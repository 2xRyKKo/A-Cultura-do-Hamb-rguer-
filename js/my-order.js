(function () {
  "use strict";

  var STORAGE_KEY = "achb.myOrder";
  // { itemId: { qty: number, excluded: [ingredientIndex, ...] } }
  var state = {};
  var isOpen = false;
  var lastFocusedEl = null;

  // Only real composed dishes get an ingredient breakdown — "Maionese
  // Extra" also lives in the Comida group but its description lists
  // flavour *choices*, not ingredients to strip from a dish, so it's
  // deliberately left out here.
  var INGREDIENT_CATEGORY_IDS = ["petiscos", "hamburgueres", "smash-burger", "pregos", "saladas", "sobremesas"];

  var fabEl, fabCountEl, drawerEl, backdropEl, listEl, emptyEl, liveRegionEl, titleEl;
  var submitBlockEl, tableInputEl, notesInputEl, submitBtnEl, submitStatusEl;

  function t(key) {
    return window.ACHB_I18N ? window.ACHB_I18N.t(key) : key;
  }

  function tf(field) {
    return window.ACHB_I18N ? window.ACHB_I18N.translateField(field) : field;
  }

  function track(event, payload) {
    if (window.ACHB_ANALYTICS) window.ACHB_ANALYTICS.track(event, payload);
  }

  function loadState() {
    try {
      var raw = window.sessionStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      state = {};
      Object.keys(parsed || {}).forEach(function (id) {
        var entry = parsed[id];
        // Normalize the old { itemId: qty } shape from before per-ingredient
        // customization existed, so a session started before this change
        // doesn't break on load.
        if (typeof entry === "number") {
          state[id] = { qty: entry, excluded: [] };
        } else if (entry && typeof entry.qty === "number") {
          state[id] = { qty: entry.qty, excluded: entry.excluded || [] };
        }
      });
    } catch (e) {
      state = {};
    }
  }

  function saveState() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* sessionStorage unavailable — selection just won't persist across a reload */
    }
  }

  function findItem(itemId) {
    var data = window.MENU_DATA || [];
    for (var i = 0; i < data.length; i++) {
      var items = data[i].items || [];
      for (var j = 0; j < items.length; j++) {
        if (items[j].id === itemId) return items[j];
      }
    }
    return null;
  }

  function findCategoryId(itemId) {
    var data = window.MENU_DATA || [];
    for (var i = 0; i < data.length; i++) {
      var items = data[i].items || [];
      for (var j = 0; j < items.length; j++) {
        if (items[j].id === itemId) return data[i].id;
      }
    }
    return null;
  }

  // Descriptions are already real comma-separated ingredient lists (see
  // menu-data.js) — reused here instead of duplicating the same data in a
  // second place. Only items with more than 2 parts get the breakdown.
  function getIngredients(item, categoryId) {
    if (INGREDIENT_CATEGORY_IDS.indexOf(categoryId) === -1) return null;
    var desc = tf(item.description);
    if (!desc) return null;
    var parts = desc
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    return parts.length > 2 ? parts : null;
  }

  function totalCount() {
    return Object.keys(state).reduce(function (sum, id) {
      return sum + state[id].qty;
    }, 0);
  }

  function addItem(itemId) {
    var entry = state[itemId] || { qty: 0, excluded: [] };
    entry.qty += 1;
    state[itemId] = entry;
    saveState();
    track("order_item_added", { item: itemId, qty: entry.qty });
    render();
    announce();
  }

  function decrementItem(itemId) {
    if (!state[itemId]) return;
    state[itemId].qty -= 1;
    if (state[itemId].qty <= 0) delete state[itemId];
    saveState();
    track("order_item_removed", { item: itemId });
    render();
    announce();
  }

  function toggleIngredient(itemId, index) {
    var entry = state[itemId];
    if (!entry) return;
    var pos = entry.excluded.indexOf(index);
    if (pos === -1) entry.excluded.push(index);
    else entry.excluded.splice(pos, 1);
    saveState();
    track("order_ingredient_toggled", { item: itemId, index: index, excluded: pos === -1 });
    render();
  }

  function announce() {
    if (!liveRegionEl) return;
    var count = totalCount();
    liveRegionEl.textContent = count + " " + t("myorder.itemsAnnounce");
  }

  function buildIngredients(itemId, item, categoryId, excluded) {
    var ingredients = getIngredients(item, categoryId);
    if (!ingredients) return null;

    var wrap = document.createElement("div");
    wrap.className = "myorder-row__ingredients";

    var label = document.createElement("p");
    label.className = "myorder-row__ingredients-label";
    label.textContent = t("myorder.ingredientsHint");
    wrap.appendChild(label);

    var chips = document.createElement("div");
    chips.className = "myorder-row__chips";

    ingredients.forEach(function (ingredient, index) {
      var isExcluded = excluded.indexOf(index) !== -1;
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "myorder-chip";
      chip.setAttribute("aria-pressed", isExcluded ? "true" : "false");
      chip.setAttribute("data-excluded", isExcluded ? "true" : "false");
      chip.textContent = ingredient;
      chip.addEventListener("click", function () {
        toggleIngredient(itemId, index);
      });
      chips.appendChild(chip);
    });

    wrap.appendChild(chips);
    return wrap;
  }

  function buildRow(itemId, entry) {
    var item = findItem(itemId);
    if (!item) return null;
    var categoryId = findCategoryId(itemId);

    var row = document.createElement("div");
    row.className = "myorder-row";

    var top = document.createElement("div");
    top.className = "myorder-row__top";

    var info = document.createElement("div");
    var nameEl = document.createElement("div");
    nameEl.className = "myorder-row__name";
    nameEl.textContent = (entry.qty > 1 ? entry.qty + "x " : "") + item.name;
    info.appendChild(nameEl);

    if (item.price) {
      var priceEl = document.createElement("div");
      priceEl.className = "myorder-row__price";
      priceEl.textContent = item.price;
      info.appendChild(priceEl);
    }

    var controls = document.createElement("div");
    controls.className = "myorder-row__controls";

    var minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "myorder-row__stepper-btn";
    minusBtn.textContent = "−";
    minusBtn.setAttribute("aria-label", t("myorder.decrease") + ": " + item.name);
    minusBtn.addEventListener("click", function () {
      decrementItem(itemId);
    });

    var plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "myorder-row__stepper-btn";
    plusBtn.textContent = "+";
    plusBtn.setAttribute("aria-label", t("myorder.increase") + ": " + item.name);
    plusBtn.addEventListener("click", function () {
      addItem(itemId);
    });

    controls.appendChild(minusBtn);
    controls.appendChild(plusBtn);

    top.appendChild(info);
    top.appendChild(controls);
    row.appendChild(top);

    var ingredientsEl = buildIngredients(itemId, item, categoryId, entry.excluded);
    if (ingredientsEl) row.appendChild(ingredientsEl);

    return row;
  }

  function render() {
    var count = totalCount();

    if (fabCountEl) fabCountEl.textContent = count;
    if (fabEl) fabEl.setAttribute("data-visible", count > 0 ? "true" : "false");
    if (titleEl) titleEl.textContent = t("myorder.title");

    if (!listEl) return;
    listEl.innerHTML = "";

    var ids = Object.keys(state);
    if (ids.length === 0) {
      if (emptyEl) {
        emptyEl.textContent = t("myorder.empty");
        emptyEl.style.display = "";
      }
      if (submitBlockEl) submitBlockEl.hidden = true;
      return;
    }
    if (emptyEl) emptyEl.style.display = "none";
    if (submitBlockEl) submitBlockEl.hidden = false;

    ids.forEach(function (id) {
      var row = buildRow(id, state[id]);
      if (row) listEl.appendChild(row);
    });
  }

  function submitOrder() {
    var tableId = (tableInputEl.value || "").toString().trim();
    if (!tableId) {
      submitStatusEl.textContent = t("myorder.errorMissingTable");
      return;
    }
    if (!window.ACHB_SUPABASE) {
      submitStatusEl.textContent = t("myorder.errorGeneric");
      return;
    }

    var items = Object.keys(state).map(function (id) {
      var item = findItem(id);
      var entry = state[id];
      var categoryId = findCategoryId(id);
      var ingredients = item ? getIngredients(item, categoryId) : null;
      var excludedNames =
        ingredients && entry.excluded.length
          ? entry.excluded.map(function (index) {
              return ingredients[index];
            })
          : [];
      return {
        id: id,
        name: item ? item.name : id,
        qty: entry.qty,
        excluded: excludedNames,
      };
    });

    submitBtnEl.disabled = true;
    submitStatusEl.textContent = t("myorder.sending");

    window.ACHB_SUPABASE.from("table_orders")
      .insert({
        table_id: tableId,
        items: items,
        notes: (notesInputEl.value || "").toString().trim() || null,
      })
      .then(function (res) {
        submitBtnEl.disabled = false;
        if (res.error) {
          submitStatusEl.textContent = t("myorder.errorGeneric");
          return;
        }
        submitStatusEl.textContent = t("myorder.success");
        track("order_submitted", { table: tableId, itemCount: items.length });
        state = {};
        saveState();
        render();
      })
      .catch(function () {
        submitBtnEl.disabled = false;
        submitStatusEl.textContent = t("myorder.errorGeneric");
      });
  }

  function getFocusable() {
    if (!drawerEl) return [];
    return Array.prototype.slice.call(
      drawerEl.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
    );
  }

  function trapFocus(e) {
    if (!isOpen || e.key !== "Tab") return;
    var focusable = getFocusable();
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openDrawer() {
    isOpen = true;
    lastFocusedEl = document.activeElement;
    if (drawerEl) drawerEl.setAttribute("data-open", "true");
    if (backdropEl) backdropEl.setAttribute("data-open", "true");
    var focusable = getFocusable();
    if (focusable.length) focusable[0].focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeDrawer() {
    isOpen = false;
    if (drawerEl) drawerEl.setAttribute("data-open", "false");
    if (backdropEl) backdropEl.setAttribute("data-open", "false");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      closeDrawer();
      return;
    }
    trapFocus(e);
  }

  function init() {
    fabEl = document.getElementById("myorder-fab");
    fabCountEl = document.getElementById("myorder-fab-count");
    drawerEl = document.getElementById("myorder-drawer");
    backdropEl = document.getElementById("myorder-backdrop");
    listEl = document.getElementById("myorder-list");
    emptyEl = document.getElementById("myorder-empty");
    liveRegionEl = document.getElementById("myorder-live");
    titleEl = document.getElementById("myorder-title");
    submitBlockEl = document.getElementById("myorder-submit-block");
    tableInputEl = document.getElementById("myorder-table-input");
    notesInputEl = document.getElementById("myorder-notes-input");
    submitBtnEl = document.getElementById("myorder-submit-btn");
    submitStatusEl = document.getElementById("myorder-submit-status");

    if (tableInputEl && window.ACHB_TABLE) tableInputEl.value = window.ACHB_TABLE;

    loadState();
    render();

    if (fabEl) fabEl.addEventListener("click", openDrawer);
    var closeBtn = document.getElementById("myorder-close");
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (backdropEl) backdropEl.addEventListener("click", closeDrawer);
    if (submitBtnEl) submitBtnEl.addEventListener("click", submitOrder);
  }

  window.ACHB_MYORDER = { addItem: addItem };

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("languagechange", render);
})();
