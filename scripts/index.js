"use strict";
(async function (window, document, navigator, location, QRious) {
  "use strict";
  // ::: Constants
  const backToTopLabel = "Back to page top";
  // ::: Global elements
  const style = getComputedStyle(document.documentElement);
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  // const notes = document.getElementById("notes");
  const navButtons = document.querySelectorAll("nav li");
  const radioQuery = "input.page[type='radio']";
  const radios = Array.from(document.querySelectorAll(radioQuery));

  // ::: Register service worker: https://www.pwabuilder.com/serviceworker
  "serviceWorker" in navigator &&
    navigator.serviceWorker.register("./scripts/sw.js");

  const styleOf = (value, fall) => style.getPropertyValue(value) || fall;

  // ::: Instantiate QR code component
  const [tint1, tint2] = ["--color-primary-tint-2", "--color-secondary-tint-1"];
  const qr = new QRious({
    element: document.getElementById("qr"),
    value: "https://dhsrocha.github.io",
    foreground: styleOf(tint1, "#000"),
    background: styleOf(tint2, "#FFF"),
    mime: "image/svg+xml",
    level: "H",
  });
  window.matchMedia("(prefers-color-scheme: dark)").addListener(() => {
    qr.foreground = styleOf(tint1, "#000");
    qr.background = styleOf(tint2, "#FFF");
  });

  // ::: Sticky header
  const stickyClass = "sticky";
  document.onscroll = () => {
    window.pageYOffset > 0 && header.classList.add(stickyClass);
    window.pageYOffset < 10 && header.classList.remove(stickyClass);
  };

  // ::: Visual footprint for the last section accessed
  const selected = "page selected";
  const checkedId = radios.filter((e) => e.checked == true)[0].id;
  navButtons.forEach((e) => {
    e.firstElementChild.getAttribute("for") === checkedId &&
      (e.className = selected);
    e.onclick = (ev) => {
      navButtons.forEach((el) => (el.className = ""));
      ev.path[2].className = selected;
    };
  });

  // ::: Load posts and inject them in each article component
  const loadPosts = async () => {
    // TODO: Need larger range of posts
    const url =
      "https://api.github.com/repos/dhsrocha/dhsrocha.github.io/issues?" +
      "state=closed&labels=blog-post&assignee=dhsrocha&page=1&per_page=1";
    const res = await fetch(url);
    const data = await res.json();

    // TODO: Need some preloading

    const articles = document.getElementById("articles");
    data.forEach((post) => {
      const number = "article-" + post.number;

      const art = document.createElement("article");
      const h3 = document.createElement("h3");
      const p = document.createElement("p");

      art.id = number;
      h3.innerHTML = post.title;
      p.innerHTML = post.body;

      // ::: Comment box
      const script = document.createElement("script");
      script.src = "https://utteranc.es/client.js";
      script.setAttribute("repo", "dhsrocha/dhsrocha.github.io");
      script.setAttribute("issue-number", post.number);
      script.setAttribute("label", "blog-post");
      script.setAttribute("theme", "preferred-color-scheme");
      script.setAttribute("crossorigin", "anonymous");
      script.setAttribute("async", "async");

      // "Back to post beginning" button
      const div = document.createElement("div");
      div.style =
        "display: flex; justify-content: flex-end; cursor: pointer; padding: 1em 2em";

      const em = document.createElement("em");
      em.className = "far fa-arrow-alt-circle-up";
      em.setAttribute("title", "Back to article top");
      em.onclick = () => (location.href = "#" + number);

      articles.appendChild(art);
      [h3, p, script, div].forEach((e) => art.appendChild(e));
      div.appendChild(em);
    });
  };
  document
    .getElementById("nav-tab__notes")
    .addEventListener("change", loadPosts, { once: true });

  // ::: "Back to top" button
  document.querySelectorAll(["#notes", "#about", "#work"]).forEach((sec) => {
    // Final message
    const msg = document.createElement("div");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");

    h3.innerHTML = "I would like to hear you";
    p.innerHTML =
      "Reach me if you have an idea that you want to get it started. " +
      "I would be pleased to help you with something.";

    msg.appendChild(h3);
    msg.appendChild(p);
    sec.appendChild(msg);

    // "Back to top" button
    const btn = document.createElement("button");
    btn.onclick = () => window.scrollTo(0, 0);
    btn.className = "clear";
    btn.setAttribute("aria-label", backToTopLabel);
    btn.setAttribute("title", backToTopLabel);

    const em = document.createElement("em");
    em.className = "far fa-2x fa-arrow-alt-circle-up";

    const span = document.createElement("span");
    span.innerHTML = backToTopLabel;
    span.className = "undisplayed";

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

    // ::: Display entire screen only after all script is run.
    document.querySelector(".pre-load").style.opacity = 1;
  });
})(window, document, navigator, location, QRious) //
  .catch((err) => console.error(err.message));
