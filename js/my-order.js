(function () {
  "use strict";

  var STORAGE_KEY = "achb.myOrder";
  var state = {}; // { itemId: qty }
  var isOpen = false;
  var lastFocusedEl = null;

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
      if (raw) state = JSON.parse(raw) || {};
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

  function totalCount() {
    return Object.keys(state).reduce(function (sum, id) {
      return sum + state[id];
    }, 0);
  }

  function addItem(itemId) {
    state[itemId] = (state[itemId] || 0) + 1;
    saveState();
    track("order_item_added", { item: itemId, qty: state[itemId] });
    render();
    announce();
  }

  function decrementItem(itemId) {
    if (!state[itemId]) return;
    state[itemId] -= 1;
    if (state[itemId] <= 0) delete state[itemId];
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

  function buildRow(itemId, qty) {
    var item = findItem(itemId);
    if (!item) return null;

    var row = document.createElement("div");
    row.className = "myorder-row";

    var info = document.createElement("div");
    var nameEl = document.createElement("div");
    nameEl.className = "myorder-row__name";
    nameEl.textContent = (qty > 1 ? qty + "x " : "") + item.name;
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

    row.appendChild(info);
    row.appendChild(controls);
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
      return { id: id, name: item ? item.name : id, qty: state[id] };
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
