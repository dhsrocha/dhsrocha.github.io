"use strict";
// ::: Updatable service worker registration:
// https://github.com/GoogleChromeLabs/sw-precache/blob/master/demo/app/js/service-worker-registration.js#L20
(function (window, navigator) {
  "use strict";
  "serviceWorker" in navigator &&
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("sw.js")
        .then((reg) => {
          reg.onupdatefound = () => {
            const installing = reg.installing;
            installing.onstatechange = () => {
              switch (installing.state) {
                case "installed":
                  if (navigator.serviceWorker.controller)
                    console.log("New or updated content is available.");
                  else console.log("Content is now available offline!");
                  break;
                case "redundant":
                  console.error(
                    "The installing service worker became redundant."
                  );
                  break;
              }
            };
          };
        })
        .catch((e) => {
          console.error("Error during service worker registration:", e);
        });
    });
})(window, navigator);

(async function (window, document, QRious) {
  "use strict";
  // ::: Constants
  const labels = { toTop: "Back to page top" };
  const [undisplayed, transparent] = ["undisplayed", "transparent"];
  // ::: Global elements
  const style = getComputedStyle(document.documentElement);
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  const pagButtons = document.querySelectorAll("label.paged");
  const radioQuery = "input.paged[type='radio']";
  const radios = Array.from(document.querySelectorAll(radioQuery));

  const styleOf = (value, fall) => style.getPropertyValue(value) || fall;

  // ::: Instantiate QR code component
  const [tint1, tint2] = ["--color-primary-tint-3", "--color-secondary-tint-1"];
  const [rawFG, rawBG] = ["#000", "#FFF"];
  const qr = new QRious({
    element: document.getElementById("qr"),
    value: "https://dhsrocha.github.io",
    foreground: styleOf(tint1, rawFG),
    background: styleOf(tint2, rawBG),
    mime: "image/svg+xml",
    level: "H",
  });
  window.matchMedia("(prefers-color-scheme: dark)").addListener(() => {
    qr.foreground = styleOf(tint1, rawFG);
    qr.background = styleOf(tint2, rawBG);
  });

  // ::: Visual footprint for the last section accessed
  const selected = "paged selected";
  const checkedId = radios.filter((e) => e.checked == true)[0].id;
  pagButtons.forEach((e) => {
    e.getAttribute("for") === checkedId && (e.parentNode.className = selected);
    e.onclick = (ev) => {
      pagButtons.forEach((el) => (el.parentNode.className = ""));
      const path = ev.path || (ev.composedPath && ev.composedPath());
      path[2].className = selected;
    };
  });

  // ::: Load posts and inject them in each article component
  const loadPosts = async () => {
    const url =
      "https://api.github.com/repos/dhsrocha/dhsrocha.github.io/issues?" +
      "state=closed&labels=blog-post&assignee=dhsrocha";
    const res = await fetch(url);
    const data = await res.json();

    // TODO: Need some preloading

    // Posts to articles
    const articles = document.getElementById("articles");
    data.forEach((post) => {
      const artId = "article-" + post.number;

      const radio = document.createElement("input");
      const label = document.createElement("label");

      const art = document.createElement("article");
      const h3 = document.createElement("h3");
      const p = document.createElement("p");

      radio.id = "article-tab__" + post.number;
      radio.classList.add(undisplayed, "paged");
      radio.setAttribute("type", "radio");
      radio.setAttribute("name", "article-tabs");

      label.setAttribute("for", radio.id);

      art.id = artId;
      h3.innerHTML = post.title;
      p.innerHTML = post.body;

      // TODO: Jump to related posts

      // TODO: Some comment box

      // Appending elements
      label.appendChild(art);
      articles.appendChild(radio);
      articles.appendChild(label);
      [h3, p].forEach((e) => art.appendChild(e));
    });
    articles.style.opacity = 1;
  };
  document
    .getElementById("nav-tab__notes")
    .addEventListener("change", loadPosts, { once: true });

  // ::: Final message
  const msg = document.createElement("div");
  const h3 = document.createElement("h3");
  const p = document.createElement("p");

  h3.innerHTML = "I would like to hear you";
  p.innerHTML =
    "Reach me if you have an idea that you want to get it started. " +
    "I would be pleased to help you with something.";

  msg.appendChild(h3);
  msg.appendChild(p);
  main.appendChild(msg);

  // ::: "Back to top" button
  const toTop = document.createElement("a");
  toTop.id = "to-top";
  toTop.classList.add(transparent);
  toTop.setAttribute("href", "#top");
  toTop.setAttribute("aria-label", labels.toTop);
  toTop.setAttribute("title", labels.toTop);
  const em = document.createElement("em");
  em.className = "icons icon-arrow-up";
  const btn = document.createElement("button");
  btn.classList.add(undisplayed);
  btn.innerHTML = labels.toTop;
  [em, btn].forEach((e) => toTop.appendChild(e));
  document.body.appendChild(toTop);

  const stickyClass = "sticky";
  // ::: Document events
  document.onscroll = () => {
    // Stick header component to top
    window.pageYOffset > 0 && header.classList.add(stickyClass);
    window.pageYOffset < 10 && header.classList.remove(stickyClass);

    // Show "Back to top" button
    window.pageYOffset > 150 && toTop.classList.remove(transparent);
    window.pageYOffset <= 160 && toTop.classList.add(transparent);
  };
  // Display entire screen only after all script is run.
  document.body.style.opacity = 1;
  // :::
})(window, document, QRious).catch((err) => console.error(err.message));
