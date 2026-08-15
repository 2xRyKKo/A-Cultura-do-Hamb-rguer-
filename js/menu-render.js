(function () {
  "use strict";

  var groupsEl = null;
  var categoriesEl = null;
  var itemObserver = null;
  var viewedItems = {};
  var activeGroupId = null;

  function t(key) {
    return window.ACHB_I18N ? window.ACHB_I18N.t(key) : key;
  }

  function tf(field) {
    return window.ACHB_I18N ? window.ACHB_I18N.translateField(field) : field;
  }

  function track(event, payload) {
    if (window.ACHB_ANALYTICS) window.ACHB_ANALYTICS.track(event, payload);
  }

  function el(tag, className, children) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (children) {
      children.forEach(function (child) {
        if (child) node.appendChild(child);
      });
    }
    return node;
  }

  function textEl(tag, className, text) {
    var node = el(tag, className);
    node.textContent = text;
    return node;
  }

  function findCategory(id) {
    var data = window.MENU_DATA || [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) return data[i];
    }
    return null;
  }

  function buildPriceBlock(item) {
    if (item.variants && item.variants.length) {
      var wrap = el("div", "menu-item__variants");
      item.variants.forEach(function (v) {
        var row = textEl("span", "menu-item__variant", v.label + " — " + v.price);
        wrap.appendChild(row);
      });
      return wrap;
    }
    if (item.price) {
      return textEl("span", "menu-item__price", item.price);
    }
    return null;
  }

  function buildItem(item) {
    var main = el("div", "menu-item__main");

    var top = el("div", "menu-item__top");
    top.appendChild(textEl("span", "menu-item__name", item.name));
    if (item.badge === "bestseller") {
      top.appendChild(textEl("span", "menu-item__badge", t("burgers.badgeBestseller")));
    }
    main.appendChild(top);

    if (item.description) {
      main.appendChild(textEl("p", "menu-item__desc", tf(item.description)));
    }
    if (item.variantNote) {
      main.appendChild(textEl("p", "menu-item__desc", "(" + tf(item.variantNote) + ")"));
    }
    if (item.region) {
      main.appendChild(textEl("p", "menu-item__desc", item.region));
    }
    // Allergen info is shown once near the top of the Menu section (see
    // index.html), not repeated per item — the schema keeps `allergens`
    // ready for real per-item data once the restaurant supplies it.

    var side = el("div", "menu-item__side");
    var priceBlock = buildPriceBlock(item);
    if (priceBlock) side.appendChild(priceBlock);

    // Items with size variants (e.g. draught beers) still get a single add
    // control — Meu Pedido is a reminder list shown to the waiter, not a
    // precise spec, so the size can be clarified verbally.
    var addBtn = el("button", "menu-item__add");
    addBtn.type = "button";
    addBtn.textContent = "+";
    addBtn.setAttribute("aria-label", t("menu.addToOrder") + ": " + item.name);
    addBtn.addEventListener("click", function () {
      if (window.ACHB_MYORDER) window.ACHB_MYORDER.addItem(item.id);
    });
    side.appendChild(addBtn);

    var row = el("div", "menu-item", [main, side]);
    row.setAttribute("data-item-id", item.id);
    return row;
  }

  function buildCategory(cat) {
    var summary = el("summary");
    var summaryInner = el("div", "menu-category__summary-inner", [
      textEl("h3", "menu-category__name", tf(cat.name)),
      (function () {
        var chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        chevron.setAttribute("class", "menu-category__chevron");
        chevron.setAttribute("width", "20");
        chevron.setAttribute("height", "20");
        chevron.setAttribute("viewBox", "0 0 24 24");
        chevron.setAttribute("fill", "none");
        chevron.innerHTML = '<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        return chevron;
      })(),
    ]);
    summary.appendChild(summaryInner);

    var itemsWrap = el("div", "menu-items");
    cat.items.forEach(function (item) {
      itemsWrap.appendChild(buildItem(item));
    });

    var children = [summary];
    if (cat.note) children.push(textEl("p", "menu-category__note", tf(cat.note)));
    children.push(itemsWrap);

    var details = el("details", "menu-category", children);
    details.id = "menu-cat-" + cat.id;
    // Hambúrgueres opens by default — that's what most NFC/table scanners
    // came here to decide on, regardless of where it sits in the data order.
    if (cat.id === "hamburgueres") details.open = true;

    details.addEventListener("toggle", function () {
      if (details.open) {
        track("category_view", { category: cat.id });
        // Accordion behaviour: keep only one category open at a time so the
        // menu doesn't stack into a long, disorganised list of open panels.
        document.querySelectorAll(".menu-category").forEach(function (other) {
          if (other !== details && other.open) other.open = false;
        });
      }
    });

    return details;
  }

  function buildGroupTab(group) {
    var btn = el("button", "menu-group-tab");
    btn.type = "button";
    btn.textContent = tf(group.name);
    btn.setAttribute("data-group-btn", group.id);
    btn.addEventListener("click", function () {
      setActiveGroup(group.id);
    });
    return btn;
  }

  function updateGroupTabsState() {
    if (!groupsEl) return;
    groupsEl.querySelectorAll("[data-group-btn]").forEach(function (btn) {
      var isActive = btn.getAttribute("data-group-btn") === activeGroupId;
      btn.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function renderGroupTabs() {
    groupsEl.innerHTML = "";
    (window.MENU_GROUPS || []).forEach(function (group) {
      groupsEl.appendChild(buildGroupTab(group));
    });
    updateGroupTabsState();
  }

  function renderCategoryList(categoryIds) {
    categoryIds.forEach(function (catId) {
      var cat = findCategory(catId);
      if (!cat) return;
      categoriesEl.appendChild(buildCategory(cat));
    });
  }

  function renderActiveGroupContent() {
    var group = (window.MENU_GROUPS || []).filter(function (g) {
      return g.id === activeGroupId;
    })[0];
    if (!group) return;

    categoriesEl.innerHTML = "";

    if (group.subgroups) {
      group.subgroups.forEach(function (subgroup) {
        // column-span: all in CSS makes this break cleanly across the
        // desktop two-column flow instead of getting stranded in one side.
        categoriesEl.appendChild(textEl("h3", "menu-subgroup-heading", tf(subgroup.name)));
        renderCategoryList(subgroup.categories);
      });
    } else {
      renderCategoryList(group.categories);
    }

    observeItems();
  }

  function setActiveGroup(groupId) {
    if (groupId === activeGroupId) return;
    activeGroupId = groupId;
    updateGroupTabsState();
    renderActiveGroupContent();
    track("menu_group_view", { group: groupId });
    // Switching theme (Comida/Bebidas/Vinhos) swaps in a whole new category
    // list — without this, a visitor scrolled deep into one theme stayed at
    // that same scroll position, landing mid-way (or past the end) of the
    // new content instead of seeing it from the top.
    if (groupsEl) groupsEl.scrollIntoView({ block: "start" });
  }

  function observeItems() {
    if (itemObserver) itemObserver.disconnect();
    if (!("IntersectionObserver" in window)) return;
    itemObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("data-item-id");
            if (id && !viewedItems[id]) {
              viewedItems[id] = true;
              track("item_view", { item: id });
            }
          }
        });
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0.2 }
    );
    document.querySelectorAll(".menu-item[data-item-id]").forEach(function (node) {
      itemObserver.observe(node);
    });
  }

  function render() {
    if (!groupsEl) groupsEl = document.getElementById("menu-groups");
    if (!categoriesEl) categoriesEl = document.getElementById("menu-categories");
    if (!groupsEl || !categoriesEl) return;

    var groups = window.MENU_GROUPS || [];
    if (!activeGroupId && groups.length) activeGroupId = groups[0].id;

    renderGroupTabs();
    renderActiveGroupContent();
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    track("menu_view", {});
  });
  document.addEventListener("languagechange", render);
})();
