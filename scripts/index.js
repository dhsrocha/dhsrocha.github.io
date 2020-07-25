"use strict";
(async function (window, document, navigator, QRious) {
  "use strict";
  // ::: Constants
  const backToTopLabel = "Back to top";
  // ::: Global elements
  const style = getComputedStyle(document.documentElement);
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const notes = document.getElementById("notes");

  // ::: Register service worker: https://www.pwabuilder.com/serviceworker
  "serviceWorker" in navigator &&
    navigator.serviceWorker.register("./scripts/sw.js");

  // ::: Instantiate QR code component
  new QRious({
    element: document.getElementById("qr"),
    value: "https://dhsrocha.github.io",
    foreground: style.getPropertyValue("--color-primary-tint-3") || "#000",
    background: style.getPropertyValue("--color-secondary") || "#FFF",
  });

  const url =
    "https://api.github.com/repos/dhsrocha/dhsrocha.github.io/issues?" +
    "state=closed&labels=blog-post&assignee=dhsrocha&page=1&per_page=1";
  const res = await fetch(url);
  const data = await res.json();
  // ::: Articles
  const articles = document.createElement("section");
  notes.appendChild(articles);
  data.forEach((post) => {
    const h3 = document.createElement("h3");
    h3.innerHTML = post.title;

    const art = document.createElement("article");
    art.appendChild(h3);

    const p = document.createElement("p");
    p.innerHTML = post.body;
    art.appendChild(p);

    articles.appendChild(art);
    // ::: Comment box
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "dhsrocha/dhsrocha.github.io");
    script.setAttribute("issue-number", post.number);
    script.setAttribute("label", "blog-post");
    script.setAttribute("theme", "preferred-color-scheme");
    script.setAttribute("crossorigin", "anonymous");
    script.setAttribute("async", "async");
    art.appendChild(script);
  });

  // ::: "Back to top" button
  document.querySelectorAll(["#notes", "#about", "#work"]).forEach((sec) => {
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
    sec.appendChild(msg);

    const btn = document.createElement("button");
    btn.onclick = () => window.scrollTo(0, 0);
    btn.setAttribute("class", "clear");
    btn.setAttribute("aria-label", backToTopLabel);
    btn.setAttribute("title", backToTopLabel);

    const em = document.createElement("em");
    em.setAttribute("class", "far fa-2x fa-arrow-alt-circle-up");

    const span = document.createElement("span");
    span.innerHTML = backToTopLabel;
    span.setAttribute("class", "undisplayed");

    const toTop = document.createElement("div");
    toTop.style = "display: flex; justify-content: center; height: 6em;";
    em.appendChild(span);
    btn.appendChild(em);
    toTop.appendChild(btn);
    sec.appendChild(toTop);

    // ::: Change "Go to top" button's visibility
    sec.style = "display: block; visibility: hidden";
    const height = header.offsetHeight + footer.offsetHeight + sec.offsetHeight;
    if (height < screen.height) toTop.style = "display: none";
    sec.style = "";
  });
})(window, document, navigator, QRious);
