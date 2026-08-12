(function () {
  "use strict";

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
    initPreloadFade();
    initScrollProgress();
  });
})();
