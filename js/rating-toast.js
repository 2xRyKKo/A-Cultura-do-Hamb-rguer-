(function () {
  "use strict";

  // Fires once per session, at the same moment the Reviews section reveals
  // itself (reuses reviews-gate.js's timer/event — no separate 5-minute
  // clock). Every rating gets the same optional-comment follow-up; nothing
  // here branches on the score given.
  //
  // Marked "shown" the instant it opens (not only once the visitor responds)
  // so a reload after the toast appeared — without clicking anything — can
  // never bring it back within the same session.
  var SHOWN_KEY = "achb.ratingShown";

  var toastEl, starsEl, commentEl, dismissBtn, skipBtn, submitBtn;
  var selectedRating = null;

  function t(key) {
    return window.ACHB_I18N ? window.ACHB_I18N.t(key) : key;
  }

  function track(event, payload) {
    if (window.ACHB_ANALYTICS) window.ACHB_ANALYTICS.track(event, payload);
  }

  function hasShown() {
    try {
      return window.sessionStorage.getItem(SHOWN_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  function markShown() {
    try {
      window.sessionStorage.setItem(SHOWN_KEY, "true");
    } catch (e) {
      /* sessionStorage unavailable — toast just won't remember across reloads */
    }
  }

  function openToast() {
    if (!toastEl) return;
    toastEl.setAttribute("data-open", "true");
  }

  function closeToast() {
    if (!toastEl) return;
    toastEl.setAttribute("data-open", "false");
  }

  function setStars(rating) {
    starsEl.querySelectorAll("[data-star]").forEach(function (btn) {
      var value = parseInt(btn.getAttribute("data-star"), 10);
      btn.setAttribute("data-filled", value <= rating ? "true" : "false");
      btn.setAttribute("aria-checked", value === rating ? "true" : "false");
    });
  }

  function updateStarAriaLabels() {
    if (!starsEl) return;
    var template = t("ratingToast.starAria");
    starsEl.querySelectorAll("[data-star]").forEach(function (btn) {
      btn.setAttribute("aria-label", template.replace("{n}", btn.getAttribute("data-star")));
    });
  }

  function submitFeedback(rating, comment) {
    // Best-effort only: a failure here must never surface as an error for
    // something this lightweight — the visible "thank you" acknowledges the
    // visitor's own action, not a guarantee the row was stored server-side.
    if (!window.ACHB_SUPABASE) return;
    try {
      window.ACHB_SUPABASE.from("site_feedback")
        .insert({
          rating: rating,
          comment: comment || null,
          table_id: window.ACHB_TABLE || null,
        })
        .then(function () {})
        .catch(function () {});
    } catch (e) {
      /* ignore — see comment above */
    }
  }

  function onStarClick(e) {
    var btn = e.currentTarget;
    selectedRating = parseInt(btn.getAttribute("data-star"), 10);
    setStars(selectedRating);
    track("site_rating_given", { rating: selectedRating });
    window.setTimeout(function () {
      toastEl.setAttribute("data-step", "comment");
    }, 250);
  }

  function onSkip() {
    submitFeedback(selectedRating, null);
    closeToast();
  }

  function onSubmit() {
    var comment = (commentEl.value || "").trim();
    submitFeedback(selectedRating, comment || null);
    track("site_feedback_submitted", { rating: selectedRating, hasComment: !!comment });
    toastEl.setAttribute("data-step", "done");
    window.setTimeout(closeToast, 2200);
  }

  function onDismiss() {
    closeToast();
  }

  function maybeShow() {
    if (hasShown()) return;
    markShown();
    openToast();
  }

  function init() {
    toastEl = document.getElementById("rating-toast");
    starsEl = document.getElementById("rating-toast-stars");
    commentEl = document.getElementById("rating-toast-comment");
    dismissBtn = document.getElementById("rating-toast-dismiss");
    skipBtn = document.getElementById("rating-toast-skip");
    submitBtn = document.getElementById("rating-toast-submit");
    if (!toastEl || !starsEl) return;

    starsEl.querySelectorAll("[data-star]").forEach(function (btn) {
      btn.addEventListener("click", onStarClick);
    });
    if (dismissBtn) dismissBtn.addEventListener("click", onDismiss);
    if (skipBtn) skipBtn.addEventListener("click", onSkip);
    if (submitBtn) submitBtn.addEventListener("click", onSubmit);

    updateStarAriaLabels();
    document.addEventListener("reviewsRevealed", maybeShow);

    // Belt-and-suspenders: if the Reviews section was already revealed
    // before this script's own init ran (reviews-gate.js loads first),
    // the event above would already be missed — check the DOM directly too.
    var reviewsEl = document.getElementById("reviews");
    if (reviewsEl && reviewsEl.classList.contains("reviews--revealed")) {
      maybeShow();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("languagechange", updateStarAriaLabels);
})();
