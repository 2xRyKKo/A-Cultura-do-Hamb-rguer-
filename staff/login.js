(function () {
  "use strict";

  function init() {
    var form = document.getElementById("login-form");
    var statusEl = document.getElementById("login-status");
    var submitBtn = document.getElementById("login-submit");
    if (!form) return;

    // Already signed in with valid access? Skip straight to the dashboard.
    window.ACHB_STAFF_AUTH.getSessionAndProfile().then(function (result) {
      if (result.profile) window.location.href = "dashboard.html";
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!window.ACHB_SUPABASE) {
        statusEl.textContent = "Erro de configuração — contacta o suporte.";
        return;
      }

      var data = new FormData(form);
      submitBtn.disabled = true;
      statusEl.textContent = "A entrar...";

      window.ACHB_SUPABASE.auth
        .signInWithPassword({
          email: data.get("email"),
          password: data.get("password"),
        })
        .then(function (res) {
          submitBtn.disabled = false;
          if (res.error) {
            statusEl.textContent = "Email ou password incorretos.";
            return;
          }
          window.location.href = "dashboard.html";
        })
        .catch(function () {
          submitBtn.disabled = false;
          statusEl.textContent = "Não foi possível entrar. Tenta novamente.";
        });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
