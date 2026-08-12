/*
 * Analytics stub — local only, no network calls, no PII.
 * Buffers events in memory and mirrors them to console.debug for now.
 *
 * Future integration point: replace sendEvent()'s body with
 *   navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(event))
 * every call site (track(...)) stays unchanged.
 */
(function () {
  "use strict";

  var config = window.ACHB_CONFIG || {};
  var enabled = config.ANALYTICS_ENABLED !== false;
  var MAX_BUFFER = 500;
  var buffer = [];

  function sendEvent(event) {
    // Today: local-only. No fetch/sendBeacon call is made.
    if (buffer.length >= MAX_BUFFER) buffer.shift();
    buffer.push(event);
    if (window.console && console.debug) {
      console.debug("[achb:analytics]", event.name, event);
    }
  }

  function track(name, payload) {
    if (!enabled) return;
    try {
      var event = {
        name: name,
        ts: Date.now(),
        table: window.ACHB_TABLE || null,
        lang: window.ACHB_I18N ? window.ACHB_I18N.getLang() : null,
        payload: payload || {},
      };
      sendEvent(event);
    } catch (e) {
      // Analytics must never break the page — swallow and move on.
    }
  }

  window.ACHB_ANALYTICS = {
    track: track,
    getBuffer: function () {
      return buffer.slice();
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    track("nfc_scan", {});
  });
})();
