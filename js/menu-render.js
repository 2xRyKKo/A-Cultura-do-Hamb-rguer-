(function () {
  "use strict";

  var groupsEl = null;
  var categoriesEl = null;
  var menuSectionEl = null;
  var itemObserver = null;
  var viewedItems = {};
  var activeGroupId = null;

  // Which items currently have their "Personalizar" panel open — kept
  // outside the DOM so it survives the full re-render that a language
  // switch or theme-tab change triggers elsewhere in this file.
  var expandedPersonalize = {};

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

  // Required ingredients (bun, patty) render locked and never get a click
  // handler at all — there is no code path that can remove them.
  function buildIngredientRow(item, index, ingredient) {
    if (ingredient.required) {
      var lockRow = el("div", "menu-ingredient-row menu-ingredient-row--required");
      lockRow.appendChild(textEl("span", "menu-ingredient-row__icon", "🔒"));
      lockRow.appendChild(textEl("span", "menu-ingredient-row__name", tf(ingredient.name)));
      lockRow.appendChild(textEl("span", "menu-ingredient-row__badge", t("menu.required")));
      return lockRow;
    }

    var isExcluded = window.ACHB_MYORDER ? window.ACHB_MYORDER.getExclusions(item.id).indexOf(index) !== -1 : false;

    var btn = el("button", "menu-ingredient-row");
    btn.type = "button";
    btn.setAttribute("aria-pressed", isExcluded ? "false" : "true");
    btn.setAttribute("data-excluded", isExcluded ? "true" : "false");

    var check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    check.setAttribute("class", "menu-ingredient-row__check");
    check.setAttribute("width", "20");
    check.setAttribute("height", "20");
    check.setAttribute("viewBox", "0 0 24 24");
    check.setAttribute("fill", "none");
    check.setAttribute("aria-hidden", "true");
    check.innerHTML =
      '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path class="menu-ingredient-row__checkmark" d="M8 12.3l2.6 2.6L16.2 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    btn.appendChild(check);
    btn.appendChild(textEl("span", "menu-ingredient-row__name", tf(ingredient.name)));

    btn.addEventListener("click", function () {
      if (!window.ACHB_MYORDER) return;
      window.ACHB_MYORDER.toggleIngredient(item.id, index);
      var nowExcluded = window.ACHB_MYORDER.getExclusions(item.id).indexOf(index) !== -1;
      btn.setAttribute("aria-pressed", nowExcluded ? "false" : "true");
      btn.setAttribute("data-excluded", nowExcluded ? "true" : "false");
    });

    return btn;
  }

  function buildPersonalize(item) {
    if (!item.ingredients || !item.ingredients.length) return null;

    var isOpenState = !!expandedPersonalize[item.id];

    var wrap = el("div", "menu-item__personalize");

    var toggle = el("button", "menu-item__personalize-toggle");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", isOpenState ? "true" : "false");
    toggle.appendChild(textEl("span", null, t("menu.personalize")));
    var chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chevron.setAttribute("class", "menu-item__personalize-chevron");
    chevron.setAttribute("width", "16");
    chevron.setAttribute("height", "16");
    chevron.setAttribute("viewBox", "0 0 24 24");
    chevron.setAttribute("fill", "none");
    chevron.setAttribute("aria-hidden", "true");
    chevron.innerHTML = '<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    toggle.appendChild(chevron);

    var panel = el("div", "menu-item__personalize-panel");
    panel.setAttribute("data-open", isOpenState ? "true" : "false");

    function setOpen(nowOpen) {
      expandedPersonalize[item.id] = nowOpen;
      toggle.setAttribute("aria-expanded", nowOpen ? "true" : "false");
      panel.setAttribute("data-open", nowOpen ? "true" : "false");
      if (nowOpen) track("item_personalize_open", { item: item.id });
    }

    toggle.addEventListener("click", function () {
      setOpen(!expandedPersonalize[item.id]);
    });
    wrap.appendChild(toggle);

    panel.appendChild(textEl("p", "menu-item__personalize-heading", t("menu.ingredientsHeading")));
    item.ingredients.forEach(function (ingredient, index) {
      panel.appendChild(buildIngredientRow(item, index, ingredient));
    });
    wrap.appendChild(panel);

    // Exposed so the "add without customizing?" prompt can force this open
    // when the visitor picks "Personalizar" instead of confirming as-is.
    wrap.openPanel = function () {
      setOpen(true);
    };

    return wrap;
  }

  // A real mutually-exclusive choice (e.g. Coca-Cola: Normal ou Zero) —
  // single-select pills, first option pre-selected so there's always a
  // valid pick. Distinct from buildPersonalize: this replaces one thing
  // with another, it doesn't remove parts of a composed dish.
  function buildVariantPicker(item) {
    if (!item.variantOptions || !item.variantOptions.length) return null;

    var wrap = el("div", "menu-item__variant-picker");
    wrap.setAttribute("role", "radiogroup");

    var selected = window.ACHB_MYORDER ? window.ACHB_MYORDER.getVariant(item.id) : 0;

    item.variantOptions.forEach(function (option, index) {
      var btn = el("button", "menu-variant-pill");
      btn.type = "button";
      btn.setAttribute("role", "radio");
      var isSelected = index === selected;
      btn.setAttribute("aria-checked", isSelected ? "true" : "false");
      btn.setAttribute("data-selected", isSelected ? "true" : "false");
      btn.textContent = tf(option);
      btn.addEventListener("click", function () {
        if (!window.ACHB_MYORDER) return;
        window.ACHB_MYORDER.selectVariant(item.id, index);
        wrap.querySelectorAll(".menu-variant-pill").forEach(function (pill, pillIndex) {
          var nowSelected = pillIndex === index;
          pill.setAttribute("aria-checked", nowSelected ? "true" : "false");
          pill.setAttribute("data-selected", nowSelected ? "true" : "false");
        });
      });
      wrap.appendChild(btn);
    });

    return wrap;
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
    // variantNote is superseded by the interactive picker below once an
    // item has real variantOptions — kept in the data as a plain-text
    // fallback for the (currently nonexistent) case of a note without
    // structured options.
    if (item.variantNote && !item.variantOptions) {
      main.appendChild(textEl("p", "menu-item__desc", "(" + tf(item.variantNote) + ")"));
    }
    if (item.region) {
      main.appendChild(textEl("p", "menu-item__desc", item.region));
    }
    // Allergen info is shown once near the top of the Menu section (see
    // index.html), not repeated per item — the schema keeps `allergens`
    // ready for real per-item data once the restaurant supplies it.

    var variantPickerEl = buildVariantPicker(item);
    if (variantPickerEl) main.appendChild(variantPickerEl);

    var personalizeEl = buildPersonalize(item);
    if (personalizeEl) main.appendChild(personalizeEl);

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
      if (!window.ACHB_MYORDER) return;
      // Personalizable items always confirm first — the owner wants every
      // add of one of these to ask, not just the first time.
      if (item.ingredients && item.ingredients.length && window.ACHB_PERSONALIZE_PROMPT) {
        window.ACHB_PERSONALIZE_PROMPT.open(
          item.name,
          function () {
            if (personalizeEl && personalizeEl.openPanel) personalizeEl.openPanel();
            row.scrollIntoView({ block: "center" });
          },
          function () {
            window.ACHB_MYORDER.addItem(item.id);
          }
        );
        return;
      }
      window.ACHB_MYORDER.addItem(item.id);
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
      var scrollYBefore = window.scrollY;

      if (details.open) {
        track("category_view", { category: cat.id });
        // Accordion behaviour: keep only one category open at a time so the
        // menu doesn't stack into a long, disorganised list of open panels.
        document.querySelectorAll(".menu-category").forEach(function (other) {
          if (other !== details && other.open) other.open = false;
        });
      }
      // Opening/closing a category changes the page's height, which shifts
      // where every section below it (Onde Estamos included) actually sits.
      // GSAP's scroll-reveal trigger points are computed once and don't
      // know about this on their own — without a refresh they stay stale,
      // so a section can fire its reveal too early/late, or need extra
      // scrolling to appear at all.
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();

      // Opening/closing a category must never move the page on its own —
      // restore the exact scroll position in case the browser's native
      // <details> handling (or the refresh above) nudged it, without the
      // usual smooth-scroll animating that correction into view.
      if (window.scrollY !== scrollYBefore) {
        var htmlEl = document.documentElement;
        var prevBehavior = htmlEl.style.scrollBehavior;
        htmlEl.style.scrollBehavior = "auto";
        window.scrollTo(0, scrollYBefore);
        htmlEl.style.scrollBehavior = prevBehavior;
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

  function scrollToMenuTop() {
    var scrollTarget = menuSectionEl || groupsEl;
    if (!scrollTarget) return;
    var navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 68;
    var targetY = scrollTarget.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo(0, Math.max(targetY, 0));
  }

  function setActiveGroup(groupId) {
    if (groupId === activeGroupId) return;
    activeGroupId = groupId;
    updateGroupTabsState();
    renderActiveGroupContent();
    track("menu_group_view", { group: groupId });

    // Recalculate scroll-reveal trigger positions for the new (very likely
    // differently-sized) content BEFORE moving anything, so nothing runs
    // after the scroll below that could still be adjusting layout/scroll
    // state out from under it.
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();

    // Switching theme (Comida/Bebidas/Vinhos) swaps in a whole new category
    // list — without this, a visitor scrolled deep into one theme stayed at
    // that same scroll position, landing mid-way (or past the end) of the
    // new content instead of seeing it from the top. Targets the whole
    // #menu section (not just the tab row) — "back to the top of the menu"
    // (visible "Cardápio" heading), not a jump all the way up to the hero.
    // Run on the next animation frame, once the browser has actually
    // painted the rebuilt content and settled layout from the refresh
    // above — computing/applying the scroll in the same tick as both of
    // those DOM changes was landing in the wrong place.
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(scrollToMenuTop);
    });
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
    if (!menuSectionEl) menuSectionEl = document.getElementById("menu");
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
