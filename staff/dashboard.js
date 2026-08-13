(function () {
  "use strict";

  var sb;
  var currentProfile = null;

  function fmtDateTime(dateStr, timeStr) {
    if (!dateStr) return "";
    return dateStr + (timeStr ? " às " + timeStr.slice(0, 5) : "");
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // --------------------------------------------------------------------
  // Reservations
  // --------------------------------------------------------------------
  function renderReservations(rows) {
    var listEl = document.getElementById("reservations-list");
    listEl.innerHTML = "";
    if (!rows.length) {
      listEl.appendChild(el("p", "staff-empty", "Sem reservas ainda."));
      return;
    }
    rows.forEach(function (r) {
      var card = el("div", "staff-card");
      var top = el("div", "staff-card__top");
      top.appendChild(el("strong", null, r.name + " · " + r.party_size + " pessoas"));
      top.appendChild(el("span", "staff-badge staff-badge--" + r.status, r.status));
      card.appendChild(top);
      card.appendChild(el("p", "staff-card__meta", fmtDateTime(r.reservation_date, r.reservation_time)));
      card.appendChild(el("p", "staff-card__meta", r.phone + (r.email ? " · " + r.email : "")));
      if (r.notes) card.appendChild(el("p", "staff-card__notes", r.notes));

      if (r.status === "pending") {
        var actions = el("div", "staff-card__actions");
        var confirmBtn = el("button", "btn btn--primary staff-btn-sm", "Confirmar");
        confirmBtn.type = "button";
        confirmBtn.addEventListener("click", function () {
          updateReservationStatus(r.id, "confirmed");
        });
        var cancelBtn = el("button", "btn btn--ghost staff-btn-sm", "Cancelar");
        cancelBtn.type = "button";
        cancelBtn.addEventListener("click", function () {
          updateReservationStatus(r.id, "cancelled");
        });
        actions.appendChild(confirmBtn);
        actions.appendChild(cancelBtn);
        card.appendChild(actions);
      }

      listEl.appendChild(card);
    });
  }

  function loadReservations() {
    sb.from("reservations")
      .select("*")
      .order("created_at", { ascending: false })
      .then(function (res) {
        if (res.error) return;
        renderReservations(res.data || []);
      });
  }

  function updateReservationStatus(id, status) {
    sb.from("reservations")
      .update({ status: status })
      .eq("id", id)
      .then(function () {
        loadReservations();
      });
  }

  // --------------------------------------------------------------------
  // Table orders ("Meu Pedido" submissions)
  // --------------------------------------------------------------------
  function renderOrders(rows) {
    var listEl = document.getElementById("orders-list");
    listEl.innerHTML = "";
    if (!rows.length) {
      listEl.appendChild(el("p", "staff-empty", "Sem pedidos ainda."));
      return;
    }
    rows.forEach(function (o) {
      var card = el("div", "staff-card");
      var top = el("div", "staff-card__top");
      top.appendChild(el("strong", null, "Mesa " + o.table_id));
      top.appendChild(el("span", "staff-badge staff-badge--" + o.status, o.status));
      card.appendChild(top);

      var itemsList = el("ul", "staff-order-items");
      (o.items || []).forEach(function (item) {
        itemsList.appendChild(el("li", null, (item.qty || 1) + "x " + item.name));
      });
      card.appendChild(itemsList);
      if (o.notes) card.appendChild(el("p", "staff-card__notes", o.notes));

      if (o.status !== "done") {
        var actions = el("div", "staff-card__actions");
        var nextStatus = o.status === "new" ? "seen" : "done";
        var nextLabel = o.status === "new" ? "Marcar como visto" : "Marcar como concluído";
        var btn = el("button", "btn btn--primary staff-btn-sm", nextLabel);
        btn.type = "button";
        btn.addEventListener("click", function () {
          sb.from("table_orders")
            .update({ status: nextStatus })
            .eq("id", o.id)
            .then(loadOrders);
        });
        actions.appendChild(btn);
        card.appendChild(actions);
      }

      listEl.appendChild(card);
    });
  }

  function loadOrders() {
    sb.from("table_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(function (res) {
        if (res.error) return;
        renderOrders(res.data || []);
      });
  }

  function subscribeOrdersRealtime() {
    sb.channel("table_orders_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "table_orders" }, function () {
        loadOrders();
      })
      .subscribe();
  }

  // --------------------------------------------------------------------
  // Staff management (owner only)
  // --------------------------------------------------------------------
  function renderStaffList(rows) {
    var listEl = document.getElementById("staff-list");
    listEl.innerHTML = "";
    rows.forEach(function (p) {
      var card = el("div", "staff-card");
      var top = el("div", "staff-card__top");
      top.appendChild(el("strong", null, p.full_name || p.id));
      top.appendChild(el("span", "staff-badge", p.role));
      card.appendChild(top);

      var actions = el("div", "staff-card__actions");
      if (p.id !== currentProfile.id) {
        var toggleBtn = el("button", "btn btn--ghost staff-btn-sm", p.active ? "Desativar acesso" : "Reativar acesso");
        toggleBtn.type = "button";
        toggleBtn.addEventListener("click", function () {
          sb.from("profiles")
            .update({ active: !p.active })
            .eq("id", p.id)
            .then(loadStaffList);
        });
        actions.appendChild(toggleBtn);

        var roleBtn = el("button", "btn btn--ghost staff-btn-sm", p.role === "owner" ? "Tornar staff" : "Tornar dono");
        roleBtn.type = "button";
        roleBtn.addEventListener("click", function () {
          sb.from("profiles")
            .update({ role: p.role === "owner" ? "staff" : "owner" })
            .eq("id", p.id)
            .then(loadStaffList);
        });
        actions.appendChild(roleBtn);
      } else {
        card.appendChild(el("p", "staff-card__meta", "(tu)"));
      }
      card.appendChild(actions);
      listEl.appendChild(card);
    });
  }

  function loadStaffList() {
    sb.from("profiles")
      .select("*")
      .order("created_at", { ascending: true })
      .then(function (res) {
        if (res.error) return;
        renderStaffList(res.data || []);
      });
  }

  // --------------------------------------------------------------------
  // Boot
  // --------------------------------------------------------------------
  function init() {
    sb = window.ACHB_SUPABASE;
    if (!sb) {
      document.getElementById("dashboard-gate").textContent = "Erro de configuração.";
      return;
    }

    window.ACHB_STAFF_AUTH.getSessionAndProfile().then(function (result) {
      if (!result.profile) {
        window.location.href = "login.html";
        return;
      }
      currentProfile = result.profile;

      document.getElementById("dashboard-gate").hidden = true;
      document.getElementById("dashboard-app").hidden = false;
      document.getElementById("dashboard-user-name").textContent = result.profile.full_name || "";

      if (result.profile.role === "owner") {
        document.getElementById("staff-management-panel").hidden = false;
        loadStaffList();
      }

      loadReservations();
      loadOrders();
      subscribeOrdersRealtime();

      document.getElementById("signout-btn").addEventListener("click", function () {
        window.ACHB_STAFF_AUTH.signOut().then(function () {
          window.location.href = "login.html";
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
