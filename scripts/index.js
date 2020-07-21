"use strict";
(function (document, navigator, feather) {
  "use strict";
  // https://www.pwabuilder.com/serviceworker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./scripts/sw.js");
  }
  // https://github.com/feathericons/feather#3-use-1
  feather.replace({ "stroke-width": 1.75 });
  // :::
})(document, navigator, feather);
