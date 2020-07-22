"use strict";
(function (navigator, QRious) {
  "use strict";
  // https://www.pwabuilder.com/serviceworker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./scripts/sw.js");
  }
  // :::
  const style = getComputedStyle(document.documentElement);
  new QRious({
    element: document.getElementById("qr"),
    value: "https://dhsrocha.github.io",
    foreground: style.getPropertyValue("--color-primary-tint-3"),
    background: style.getPropertyValue("--color-secondary"),
  });
  // :::
})(navigator, QRious);
