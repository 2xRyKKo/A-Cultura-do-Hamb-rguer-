(function () {
  "use strict";

  function forceStartAtHero() {
    // Belt-and-suspenders alongside the early history.scrollRestoration
    // fix in <head>: guarantees every load starts at the top (the video),
    // never mid-page, and clears any #fragment so a reload doesn't jump
    // straight back to wherever the last section anchor pointed.
    //
    // A one-off correction isn't enough: confirmed live that with a
    // #fragment present, the browser keeps re-scrolling toward it as the
    // page's layout keeps shifting during initial load (menu content
    // rendering in, video/fonts settling) — measured scrollY actually
    // *increasing* over several seconds despite an immediate + delayed
    // correction. So this actively holds the page at the top for a short
    // window after load, correcting every tick, rather than trusting a
    // single fix to stick.
    var html = document.documentElement;
    var originalScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto"; // don't fight an in-progress smooth-scroll

    function snapToTop() {
      window.scrollTo(0, 0);
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }

    snapToTop();
    var holdUntil = Date.now() + 2500;
    var holdInterval = window.setInterval(function () {
      if (window.scrollY > 0) snapToTop();
      if (Date.now() >= holdUntil) stopHolding();
    }, 100);

    function stopHolding() {
      window.clearInterval(holdInterval);
      html.style.scrollBehavior = originalScrollBehavior;
      document.removeEventListener("touchstart", stopHolding);
      document.removeEventListener("wheel", stopHolding);
      document.removeEventListener("pointerdown", stopHolding);
    }

    // The moment the visitor tries to scroll themselves — touch drag, wheel,
    // trackpad, even just a tap — trust that completely and stop correcting.
    // This loop exists only to fight the browser's own fragment-driven
    // re-scroll while the page is still settling on its own, never the
    // visitor's own input; without this, a scroll attempt in the first
    // 2.5s got silently snapped back to the top.
    document.addEventListener("touchstart", stopHolding, { passive: true, once: true });
    document.addEventListener("wheel", stopHolding, { passive: true, once: true });
    document.addEventListener("pointerdown", stopHolding, { passive: true, once: true });
  }

  function initPreloadFade() {
    document.body.classList.remove("preload");
  }

  function initScrollProgress() {
    var bar = document.querySelector(".scroll-progress");
    if (!bar) return;
    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  document.addEventListener("DOMContentLoaded", function () {
    forceStartAtHero();
    initPreloadFade();
    initScrollProgress();
  });
})();
