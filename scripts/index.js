"use strict";
(function (navigator) {
  "use strict";
  // https://www.pwabuilder.com/serviceworker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./scripts/sw.js");
  }
  // :::
})(navigator);
