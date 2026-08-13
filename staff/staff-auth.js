// Shared helpers for staff/login.html and staff/dashboard.html.
window.ACHB_STAFF_AUTH = (function () {
  "use strict";

  function client() {
    return window.ACHB_SUPABASE;
  }

  // Resolves to { session, profile } — profile is null if the signed-in
  // user has no row in `profiles` (shouldn't happen for anyone the owner
  // added via the dashboard) or if `active` is false (access revoked).
  function getSessionAndProfile() {
    var sb = client();
    if (!sb) return Promise.resolve({ session: null, profile: null });

    return sb.auth.getSession().then(function (res) {
      var session = res.data && res.data.session;
      if (!session) return { session: null, profile: null };

      return sb
        .from("profiles")
        .select("id, full_name, role, active")
        .eq("id", session.user.id)
        .single()
        .then(function (profRes) {
          var profile = profRes.data && profRes.data.active ? profRes.data : null;
          return { session: session, profile: profile };
        });
    });
  }

  function signOut() {
    var sb = client();
    if (!sb) return Promise.resolve();
    return sb.auth.signOut();
  }

  return { getSessionAndProfile: getSessionAndProfile, signOut: signOut };
})();
