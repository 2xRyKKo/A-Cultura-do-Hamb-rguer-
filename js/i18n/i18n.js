(function () {
  "use strict";

  var STORAGE_KEY = "achb.lang";
  var config = window.ACHB_CONFIG || {};
  var supported = config.SUPPORTED_LANGS || ["pt", "en", "es"];
  var defaultLang = config.DEFAULT_LANG || "pt";

  function getStoredLang() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && supported.indexOf(stored) !== -1) return stored;
    } catch (e) {
      /* localStorage unavailable — fall through to default */
    }
    return null;
  }

  function resolvePath(obj, path) {
    var parts = path.split(".");
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return null;
      cur = cur[parts[i]];
    }
    return cur;
  }

  var currentLang = getStoredLang() || defaultLang;

  function applyTranslations() {
    var dict = window.TRANSLATIONS[currentLang];
    if (!dict) return;

    document.documentElement.lang = currentLang;

    var textNodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < textNodes.length; i++) {
      var el = textNodes[i];
      var key = el.getAttribute("data-i18n");
      var value = resolvePath(dict, key);
      if (typeof value === "string") {
        el.textContent = value;
      }
    }

    var attrNodes = document.querySelectorAll("[data-i18n-attr]");
    for (var j = 0; j < attrNodes.length; j++) {
      var attrEl = attrNodes[j];
      var mapJson = attrEl.getAttribute("data-i18n-attr");
      try {
        var map = JSON.parse(mapJson);
        Object.keys(map).forEach(function (attrName) {
          var attrValue = resolvePath(dict, map[attrName]);
          if (typeof attrValue === "string") {
            attrEl.setAttribute(attrName, attrValue);
          }
        });
      } catch (e) {
        /* malformed data-i18n-attr JSON — skip this node */
      }
    }

    var langSwitchToLabel = resolvePath(dict, "nav.langSwitchTo");
    var langButtons = document.querySelectorAll("[data-lang-btn]");
    for (var k = 0; k < langButtons.length; k++) {
      var btn = langButtons[k];
      var btnLang = btn.getAttribute("data-lang-btn");
      var isCurrent = btnLang === currentLang;
      btn.setAttribute("aria-current", isCurrent ? "true" : "false");
      if (typeof langSwitchToLabel === "string") {
        btn.setAttribute("aria-label", langSwitchToLabel + " " + btnLang.toUpperCase());
      }
    }
  }

  function setLang(lang) {
    if (supported.indexOf(lang) === -1 || lang === currentLang) return;
    currentLang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage unavailable — language choice just won't persist across reloads */
    }
    applyTranslations();
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: lang } }));
    if (window.ACHB_ANALYTICS) window.ACHB_ANALYTICS.track("language_change", { lang: lang });
  }

  function initLangButtons() {
    var langButtons = document.querySelectorAll("[data-lang-btn]");
    for (var i = 0; i < langButtons.length; i++) {
      langButtons[i].addEventListener("click", function () {
        setLang(this.getAttribute("data-lang-btn"));
      });
    }
  }

  window.ACHB_I18N = {
    getLang: function () {
      return currentLang;
    },
    setLang: setLang,
    t: function (key) {
      var dict = window.TRANSLATIONS[currentLang];
      var value = resolvePath(dict, key);
      return typeof value === "string" ? value : key;
    },
    translateField: function (field) {
      // field is an {pt,en,es} object as used in menu-data.js
      if (field == null) return "";
      if (typeof field === "string") return field;
      return field[currentLang] || field[defaultLang] || "";
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    applyTranslations();
    initLangButtons();
  });
})();
