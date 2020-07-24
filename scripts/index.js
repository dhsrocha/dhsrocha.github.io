"use strict";
(function (window, document, navigator, QRious) {
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
  // ::: Go to top button
  document.querySelectorAll(["#notes", "#about", "#work"]).forEach((el) => {
    // Final message
    const msg = document.createElement("div");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");

    p.innerHTML =
      "Reach me if you have an idea that you want to get it started. " +
      "I would be pleased to help you with something.";
    h3.innerHTML = "I would like to hear you";

    msg.appendChild(h3);
    msg.appendChild(p);
    el.appendChild(msg);

    // Go back button
    const label = "Back to top";

    const btn = document.createElement("button");
    btn.onclick = () => window.scrollTo(0, 0);
    btn.setAttribute("class", "clear");
    btn.setAttribute("aria-label", label);

    const em = document.createElement("em");
    em.setAttribute("class", "far fa-2x fa-arrow-alt-circle-up");

    const span = document.createElement("span");
    span.innerHTML = label;
    span.setAttribute("class", "undisplayed");

    const goBack = document.createElement("div");
    em.appendChild(span);
    btn.appendChild(em);
    goBack.appendChild(btn);
    el.appendChild(goBack);
  });
  // :::
})(window, document, navigator, QRious);
