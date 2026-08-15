(function () {
  "use strict";

  var STORAGE_KEY = "achb.myOrder";
  // { qty: { itemId: number }, exclusions: { itemId: [ingredientIndex, ...] } }
  // qty and exclusions are independent on purpose: customization can be set
  // from the menu card before an item is ever added, and stays put across
  // qty changes — increasing quantity of the same item never splits it into
  // separate differently-customized lines.
  var qty = {};
  var exclusions = {};
  var isOpen = false;
  var lastFocusedEl = null;

  var fabEl, fabCountEl, drawerEl, backdropEl, listEl, emptyEl, liveRegionEl, titleEl;
  var submitBlockEl, tablePickerEl, notesInputEl, submitBtnEl, submitStatusEl;

  // No confirmed real table count for this restaurant (see project notes) —
  // 30 mirrors the reservation form's own party-size cap already used
  // elsewhere on this site, generous enough not to block a real table.
  var MAX_TABLE_NUMBER = 30;
  var selectedTable = null;

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
      qty = {};
      exclusions = {};
      if (parsed && parsed.qty && typeof parsed.qty === "object") {
        Object.keys(parsed.qty).forEach(function (id) {
          if (typeof parsed.qty[id] === "number" && parsed.qty[id] > 0) qty[id] = parsed.qty[id];
        });
      }
      if (parsed && parsed.exclusions && typeof parsed.exclusions === "object") {
        Object.keys(parsed.exclusions).forEach(function (id) {
          if (Array.isArray(parsed.exclusions[id])) exclusions[id] = parsed.exclusions[id];
        });
      }
    } catch (e) {
      qty = {};
      exclusions = {};
    }
  }

  function saveState() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ qty: qty, exclusions: exclusions }));
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

  function getExclusions(itemId) {
    return exclusions[itemId] || [];
  }

  function toggleIngredient(itemId, index) {
    var item = findItem(itemId);
    var ingredient = item && item.ingredients ? item.ingredients[index] : null;
    // Defense in depth: the UI never wires up a click for a required
    // ingredient (bun/patty), but this guard makes it impossible to remove
    // one even if called some other way.
    if (!ingredient || ingredient.required) return;

    var list = exclusions[itemId] ? exclusions[itemId].slice() : [];
    var pos = list.indexOf(index);
    if (pos === -1) list.push(index);
    else list.splice(pos, 1);
    exclusions[itemId] = list;
    saveState();
    track("order_ingredient_toggled", { item: itemId, index: index, excluded: pos === -1 });
    render();
  }

  function totalCount() {
    return Object.keys(qty).reduce(function (sum, id) {
      return sum + qty[id];
    }, 0);
  }

  function addItem(itemId) {
    qty[itemId] = (qty[itemId] || 0) + 1;
    saveState();
    track("order_item_added", { item: itemId, qty: qty[itemId] });
    render();
    announce();
  }

  function decrementItem(itemId) {
    if (!qty[itemId]) return;
    qty[itemId] -= 1;
    if (qty[itemId] <= 0) delete qty[itemId];
    saveState();
    track("order_item_removed", { item: itemId });
    render();
    announce();
  }

  function announce() {
    if (!liveRegionEl) return;
    var count = totalCount();
    liveRegionEl.textContent = count + " " + t("myorder.itemsAnnounce");
  }

  function excludedNames(item, itemId) {
    if (!item.ingredients) return [];
    return getExclusions(itemId)
      .slice()
      .sort(function (a, b) {
        return a - b;
      })
      .map(function (index) {
        var ing = item.ingredients[index];
        return ing ? tf(ing.name) : null;
      })
      .filter(Boolean);
  }

  function buildRow(itemId, itemQty) {
    var item = findItem(itemId);
    if (!item) return null;

    var row = document.createElement("div");
    row.className = "myorder-row";

    var top = document.createElement("div");
    top.className = "myorder-row__top";

    var info = document.createElement("div");
    var nameEl = document.createElement("div");
    nameEl.className = "myorder-row__name";
    nameEl.textContent = (itemQty > 1 ? itemQty + "x " : "") + item.name;
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

    // Read-only summary — editing customization happens on the menu card,
    // not here, so this is just "what did I pick" at a glance.
    var names = excludedNames(item, itemId);
    if (names.length) {
      var summary = document.createElement("div");
      summary.className = "myorder-row__excluded";

      var summaryToggle = document.createElement("button");
      summaryToggle.type = "button";
      summaryToggle.className = "myorder-row__excluded-toggle";
      summaryToggle.setAttribute("aria-expanded", "false");
      summaryToggle.textContent =
        names.length === 1 ? t("myorder.excludedCountOne") : t("myorder.excludedCountMany").replace("{n}", names.length);

      var summaryPanel = document.createElement("p");
      summaryPanel.className = "myorder-row__excluded-panel";
      summaryPanel.setAttribute("data-open", "false");
      summaryPanel.textContent = t("myorder.withoutLabel") + " " + names.join(", ");

      summaryToggle.addEventListener("click", function () {
        var isOpenNow = summaryPanel.getAttribute("data-open") === "true";
        summaryPanel.setAttribute("data-open", isOpenNow ? "false" : "true");
        summaryToggle.setAttribute("aria-expanded", isOpenNow ? "false" : "true");
      });

      summary.appendChild(summaryToggle);
      summary.appendChild(summaryPanel);
      row.appendChild(summary);
    }

    return row;
  }

  function render() {
    var count = totalCount();

    if (fabCountEl) fabCountEl.textContent = count;
    if (fabEl) fabEl.setAttribute("data-visible", count > 0 ? "true" : "false");
    if (titleEl) titleEl.textContent = t("myorder.title");

    if (!listEl) return;
    listEl.innerHTML = "";

    var ids = Object.keys(qty);
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
      var row = buildRow(id, qty[id]);
      if (row) listEl.appendChild(row);
    });
  }

  function selectTable(n, scrollIntoView) {
    selectedTable = n;
    if (!tablePickerEl) return;
    tablePickerEl.querySelectorAll("[data-table]").forEach(function (btn) {
      var isSelected = parseInt(btn.getAttribute("data-table"), 10) === n;
      btn.setAttribute("aria-checked", isSelected ? "true" : "false");
      btn.setAttribute("data-selected", isSelected ? "true" : "false");
      // A table pre-filled from the NFC tag could be scrolled out of view
      // in the swipeable strip — bring it into view so it's clear it's
      // already picked, rather than looking unselected.
      if (isSelected && scrollIntoView) btn.scrollIntoView({ block: "nearest", inline: "center" });
    });
  }

  function buildTablePicker() {
    if (!tablePickerEl) return;
    tablePickerEl.innerHTML = "";
    for (var n = 1; n <= MAX_TABLE_NUMBER; n++) {
      (function (n) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "myorder-table-pill";
        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", "false");
        btn.setAttribute("data-table", n);
        btn.textContent = n;
        btn.addEventListener("click", function () {
          selectTable(n);
        });
        tablePickerEl.appendChild(btn);
      })(n);
    }

    var fromTag = parseInt(window.ACHB_TABLE, 10);
    if (fromTag && fromTag >= 1 && fromTag <= MAX_TABLE_NUMBER) selectTable(fromTag, true);
  }

  function submitOrder() {
    if (!selectedTable) {
      submitStatusEl.textContent = t("myorder.errorMissingTable");
      return;
    }
    var tableId = String(selectedTable);
    if (!window.ACHB_SUPABASE) {
      submitStatusEl.textContent = t("myorder.errorGeneric");
      return;
    }

    var items = Object.keys(qty).map(function (id) {
      var item = findItem(id);
      return {
        id: id,
        name: item ? item.name : id,
        qty: qty[id],
        excluded: item ? excludedNames(item, id) : [],
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
        qty = {};
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
    tablePickerEl = document.getElementById("myorder-table-picker");
    notesInputEl = document.getElementById("myorder-notes-input");
    submitBtnEl = document.getElementById("myorder-submit-btn");
    submitStatusEl = document.getElementById("myorder-submit-status");

    buildTablePicker();
    loadState();
    render();

    if (fabEl) fabEl.addEventListener("click", openDrawer);
    var closeBtn = document.getElementById("myorder-close");
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (backdropEl) backdropEl.addEventListener("click", closeDrawer);
    if (submitBtnEl) submitBtnEl.addEventListener("click", submitOrder);
  }

  window.ACHB_MYORDER = {
    addItem: addItem,
    getExclusions: getExclusions,
    toggleIngredient: toggleIngredient,
  };

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("languagechange", render);
})();
