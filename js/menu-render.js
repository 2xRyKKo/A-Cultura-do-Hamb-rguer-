(function () {
  "use strict";

  var pillsEl = null;
  var categoriesEl = null;
  var itemObserver = null;
  var viewedItems = {};

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

  function buildCategory(cat, index) {
    var summary = el("summary");
    var summaryInner = el("div", "menu-category__summary-inner", [
      textEl("span", null, tf(cat.name)),
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
    if (index === 0) details.open = true;

    details.addEventListener("toggle", function () {
      if (details.open) track("category_view", { category: cat.id });
    });

    return details;
  }

  function buildPill(cat) {
    var btn = el("button", "menu-pill");
    btn.type = "button";
    btn.textContent = tf(cat.name);
    btn.setAttribute("data-pill-for", cat.id);
    btn.addEventListener("click", function () {
      var target = document.getElementById("menu-cat-" + cat.id);
      if (!target) return;
      if (!target.open) target.open = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      track("category_view", { category: cat.id, via: "pill" });
    });
    return btn;
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
    if (!pillsEl) pillsEl = document.getElementById("menu-pills");
    if (!categoriesEl) categoriesEl = document.getElementById("menu-categories");
    if (!pillsEl || !categoriesEl) return;

    var data = window.MENU_DATA || [];
    pillsEl.innerHTML = "";
    categoriesEl.innerHTML = "";

    data.forEach(function (cat, index) {
      pillsEl.appendChild(buildPill(cat));
      categoriesEl.appendChild(buildCategory(cat, index));
    });

    observeItems();
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    track("menu_view", {});
  });
  document.addEventListener("languagechange", render);
})();
