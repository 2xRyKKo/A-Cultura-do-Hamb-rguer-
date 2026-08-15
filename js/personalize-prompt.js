(function () {
  "use strict";

  var promptEl, backdropEl, titleEl, customizeBtn, confirmBtn;
  var currentOnCustomize = null;
  var currentOnConfirm = null;
  var lastFocusedEl = null;

  function t(key) {
    return window.ACHB_I18N ? window.ACHB_I18N.t(key) : key;
  }

  function getFocusable() {
    if (!promptEl) return [];
    return Array.prototype.slice.call(promptEl.querySelectorAll("button"));
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;
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

  function onKeydown(e) {
    if (e.key === "Escape") {
      close();
      return;
    }
    trapFocus(e);
  }

  function close() {
    if (promptEl) promptEl.setAttribute("data-open", "false");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
    currentOnCustomize = null;
    currentOnConfirm = null;
  }

  // itemName: plain string, already resolved to the current language.
  // onCustomize/onConfirm: called after the prompt has closed.
  function open(itemName, onCustomize, onConfirm) {
    if (!promptEl) return;
    currentOnCustomize = onCustomize;
    currentOnConfirm = onConfirm;
    lastFocusedEl = document.activeElement;
    if (titleEl) titleEl.textContent = t("personalizePrompt.title").replace("{item}", itemName);
    promptEl.setAttribute("data-open", "true");
    document.addEventListener("keydown", onKeydown);
    if (customizeBtn) customizeBtn.focus();
  }

  function init() {
    promptEl = document.getElementById("personalize-prompt");
    backdropEl = document.getElementById("personalize-prompt-backdrop");
    titleEl = document.getElementById("personalize-prompt-title");
    customizeBtn = document.getElementById("personalize-prompt-customize");
    confirmBtn = document.getElementById("personalize-prompt-confirm");
    if (!promptEl) return;

    if (backdropEl) backdropEl.addEventListener("click", close);
    if (customizeBtn) {
      customizeBtn.addEventListener("click", function () {
        var fn = currentOnCustomize;
        close();
        if (fn) fn();
      });
    }
    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        var fn = currentOnConfirm;
        close();
        if (fn) fn();
      });
    }
  }

  window.ACHB_PERSONALIZE_PROMPT = { open: open };

  document.addEventListener("DOMContentLoaded", init);
})();
