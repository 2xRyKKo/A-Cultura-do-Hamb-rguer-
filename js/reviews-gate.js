(function () {
  "use strict";

  var SESSION_KEY = "achb.sessionStart";
  var config = window.ACHB_CONFIG || {};
  var delayMs = (config.REVIEWS_DELAY_MINUTES || 5) * 60 * 1000;

  function getSessionStart() {
    try {
      var stored = window.sessionStorage.getItem(SESSION_KEY);
      if (stored) return parseInt(stored, 10);
      var now = Date.now();
      window.sessionStorage.setItem(SESSION_KEY, String(now));
      return now;
    } catch (e) {
      // sessionStorage unavailable — treat every load as a fresh session start.
      return Date.now();
    }
  }

  function reveal(sectionEl) {
    sectionEl.classList.add("reviews--revealed");
    document.dispatchEvent(new CustomEvent("reviewsRevealed"));
    if (window.ACHB_ANALYTICS) window.ACHB_ANALYTICS.track("reviews_revealed", {});
  }

  function init() {
    var sectionEl = document.getElementById("reviews");
    if (!sectionEl) return;

    var start = getSessionStart();
    var elapsed = Date.now() - start;
    var remaining = delayMs - elapsed;

    // Always fire on a timer, even a 0ms one, rather than calling reveal()
    // synchronously here when remaining <= 0. A synchronous call would
    // dispatch "reviewsRevealed" before other scripts that also listen for
    // it (rating-toast.js) have run their own DOMContentLoaded handler and
    // registered their listener yet — deferring one tick guarantees every
    // DOMContentLoaded-registered listener is already in place first.
    window.setTimeout(
      function () {
        reveal(sectionEl);
      },
      Math.max(remaining, 0)
    );
  }

  document.addEventListener("DOMContentLoaded", init);
})();
