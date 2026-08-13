(function () {
  "use strict";

  var REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (REDUCE_MOTION) return;

  // --------------------------------------------------------------------
  // Desktop: magnetic hover on primary buttons/pills — the pointer nudges
  // the element a few px toward itself, springs back on leave. Fine-pointer
  // devices only (mouse/trackpad), skipped entirely on touch.
  // --------------------------------------------------------------------
  function initMagneticHover() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var targets = document.querySelectorAll(".btn, .menu-pill, .myorder-fab");
    targets.forEach(function (el) {
      var strength = 14;
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform =
          "translate(" + (x / rect.width) * strength + "px, " + (y / rect.height) * strength + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  // --------------------------------------------------------------------
  // Mobile: a soft ripple on tap for any tappable surface, so touch feels
  // acknowledged immediately (feedback within ~0ms perceived, per touch
  // UX guidance) without interfering with the element's own click handler.
  // --------------------------------------------------------------------
  function initTouchRipple() {
    if (!("ontouchstart" in window)) return;

    document.addEventListener(
      "touchstart",
      function (e) {
        var target = e.target.closest("button, a[href], .menu-pill");
        if (!target) return;

        var rect = target.getBoundingClientRect();
        var touch = e.touches[0];
        var ripple = document.createElement("span");
        ripple.className = "touch-ripple";
        var size = Math.max(rect.width, rect.height) * 1.6;
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = touch.clientX - rect.left - size / 2 + "px";
        ripple.style.top = touch.clientY - rect.top - size / 2 + "px";

        var computedPosition = getComputedStyle(target).position;
        if (computedPosition === "static") target.style.position = "relative";
        target.style.overflow = target.style.overflow || "hidden";
        target.appendChild(ripple);

        window.setTimeout(function () {
          ripple.remove();
        }, 500);
      },
      { passive: true }
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMagneticHover();
    initTouchRipple();
  });
})();
