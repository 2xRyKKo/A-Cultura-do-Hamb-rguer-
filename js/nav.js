(function () {
  "use strict";

  var navEl, hamburgerEl, overlayEl, lastFocusedEl;
  var isOpen = false;

  var langSwitchEl, langSwitchTriggerEl, langSwitchMenuEl, langSwitchCurrentEl;
  var isLangOpen = false;

  function getFocusable(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
    );
  }

  function trapFocus(e) {
    if (!isOpen || e.key !== "Tab" || !overlayEl) return;
    var focusable = getFocusable(overlayEl);
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
      closeMenu();
      return;
    }
    trapFocus(e);
  }

  function t(key) {
    return window.ACHB_I18N ? window.ACHB_I18N.t(key) : key;
  }

  function updateHamburgerLabel() {
    if (!hamburgerEl) return;
    hamburgerEl.setAttribute("aria-label", t(isOpen ? "nav.closeMenu" : "nav.openMenu"));
  }

  function openMenu() {
    isOpen = true;
    lastFocusedEl = document.activeElement;
    if (overlayEl) overlayEl.setAttribute("data-open", "true");
    if (hamburgerEl) hamburgerEl.setAttribute("aria-expanded", "true");
    updateHamburgerLabel();
    document.documentElement.style.overflow = "hidden";
    var focusable = overlayEl ? getFocusable(overlayEl) : [];
    if (focusable.length) focusable[0].focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeMenu() {
    isOpen = false;
    if (overlayEl) overlayEl.setAttribute("data-open", "false");
    if (hamburgerEl) hamburgerEl.setAttribute("aria-expanded", "false");
    updateHamburgerLabel();
    document.documentElement.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function onLangSwitchDocClick(e) {
    if (langSwitchEl && !langSwitchEl.contains(e.target)) closeLangSwitch();
  }

  function onLangSwitchKeydown(e) {
    if (e.key === "Escape") {
      closeLangSwitch();
      if (langSwitchTriggerEl) langSwitchTriggerEl.focus();
    }
  }

  function openLangSwitch() {
    isLangOpen = true;
    langSwitchEl.setAttribute("data-open", "true");
    langSwitchTriggerEl.setAttribute("aria-expanded", "true");
    document.addEventListener("click", onLangSwitchDocClick);
    document.addEventListener("keydown", onLangSwitchKeydown);
  }

  function closeLangSwitch() {
    isLangOpen = false;
    if (langSwitchEl) langSwitchEl.setAttribute("data-open", "false");
    if (langSwitchTriggerEl) langSwitchTriggerEl.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", onLangSwitchDocClick);
    document.removeEventListener("keydown", onLangSwitchKeydown);
  }

  function updateLangSwitchTrigger() {
    if (langSwitchCurrentEl && window.ACHB_I18N) {
      langSwitchCurrentEl.textContent = window.ACHB_I18N.getLang().toUpperCase();
    }
  }

  function initLangSwitch() {
    langSwitchEl = document.getElementById("lang-switch");
    langSwitchTriggerEl = document.getElementById("lang-switch-trigger");
    langSwitchMenuEl = document.getElementById("lang-switch-menu");
    langSwitchCurrentEl = document.getElementById("lang-switch-current");
    if (!langSwitchEl || !langSwitchTriggerEl || !langSwitchMenuEl) return;

    updateLangSwitchTrigger();

    langSwitchTriggerEl.addEventListener("click", function () {
      if (isLangOpen) closeLangSwitch();
      else openLangSwitch();
    });

    langSwitchMenuEl.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", closeLangSwitch);
    });
  }

  function initScrollState() {
    var heroEl = document.getElementById("hero");
    if (!heroEl || !navEl) return;

    if (window.gsap && window.ScrollTrigger && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.ScrollTrigger.create({
        trigger: heroEl,
        start: "top top",
        end: "bottom top",
        onLeave: function () {
          navEl.classList.add("nav--solid");
        },
        onEnterBack: function () {
          navEl.classList.remove("nav--solid");
        },
      });
    } else {
      // Fallback without GSAP/ScrollTrigger (or reduced motion): plain scroll listener.
      window.addEventListener(
        "scroll",
        function () {
          var pastHero = window.scrollY > heroEl.offsetHeight - 80;
          navEl.classList.toggle("nav--solid", pastHero);
        },
        { passive: true }
      );
    }
  }

  function init() {
    navEl = document.getElementById("site-nav");
    hamburgerEl = document.getElementById("nav-hamburger");
    overlayEl = document.getElementById("nav-overlay");

    if (hamburgerEl) {
      hamburgerEl.addEventListener("click", function () {
        if (isOpen) closeMenu();
        else openMenu();
      });
    }

    if (overlayEl) {
      overlayEl.querySelectorAll("a[href]").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });
      overlayEl.addEventListener("click", function (e) {
        if (e.target === overlayEl) closeMenu();
      });
    }

    initLangSwitch();
    initScrollState();
  }

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("languagechange", updateHamburgerLabel);
  document.addEventListener("languagechange", updateLangSwitchTrigger);
})();
