(function () {
  "use strict";

  function t(key) {
    return window.ACHB_I18N ? window.ACHB_I18N.t(key) : key;
  }

  function setStatus(el, message, isError) {
    el.textContent = message;
    el.classList.toggle("reservation-form__status--error", !!isError);
  }

  function init() {
    var form = document.getElementById("reservation-form");
    var statusEl = document.getElementById("reservation-status");
    var submitBtn = document.getElementById("reservation-submit");
    if (!form || !statusEl || !submitBtn) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!window.ACHB_SUPABASE) {
        setStatus(statusEl, t("reservations.errorGeneric"), true);
        return;
      }

      var data = new FormData(form);
      var payload = {
        name: (data.get("name") || "").toString().trim(),
        email: (data.get("email") || "").toString().trim() || null,
        phone: (data.get("phone") || "").toString().trim(),
        party_size: parseInt(data.get("partySize"), 10),
        reservation_date: data.get("date"),
        reservation_time: data.get("time"),
        notes: (data.get("notes") || "").toString().trim() || null,
      };

      if (!payload.name || !payload.phone || !payload.party_size || !payload.reservation_date || !payload.reservation_time) {
        setStatus(statusEl, t("reservations.errorMissing"), true);
        return;
      }

      submitBtn.disabled = true;
      setStatus(statusEl, t("reservations.sending"), false);

      window.ACHB_SUPABASE.from("reservations")
        .insert(payload)
        .then(function (res) {
          submitBtn.disabled = false;
          if (res.error) {
            setStatus(statusEl, t("reservations.errorGeneric"), true);
            return;
          }
          form.reset();
          setStatus(statusEl, t("reservations.success"), false);
          if (window.ACHB_ANALYTICS) window.ACHB_ANALYTICS.track("reservation_submitted", {});
        })
        .catch(function () {
          submitBtn.disabled = false;
          setStatus(statusEl, t("reservations.errorGeneric"), true);
        });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
