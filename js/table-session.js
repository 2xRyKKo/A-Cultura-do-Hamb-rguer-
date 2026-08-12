(function () {
  "use strict";

  var STORAGE_KEY = "achb.tableId";
  var config = window.ACHB_CONFIG || {};
  var paramName = config.TABLE_PARAM_NAME || "t";

  function resolveTableId() {
    try {
      var params = new URLSearchParams(window.location.search);
      var fromUrl = params.get(paramName);
      if (fromUrl) {
        window.sessionStorage.setItem(STORAGE_KEY, fromUrl);
        return fromUrl;
      }
      return window.sessionStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  window.ACHB_TABLE = resolveTableId();
})();
