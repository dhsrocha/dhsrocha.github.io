"use strict";
// ::: Updatable service worker registration:
// https://github.com/GoogleChromeLabs/sw-precache/blob/master/demo/app/js/service-worker-registration.js#L20
(async function (window, navigator) {
  "use strict";
  "serviceWorker" in navigator &&
    window.addEventListener("load", async () => {
      const reg = await navigator.serviceWorker.register("sw.js");
      reg.onupdatefound = () => {
        const installing = reg.installing;
        installing.onstatechange = () => {
          switch (installing.state) {
            case "installed":
              if (navigator.serviceWorker.controller)
                console.log("New or updated content is available.");
              else throw new Error("Content is now available offline!");
              break;
            case "redundant":
              const msg = "The installing service worker became redundant.";
              throw new Error(msg);
          }
        };
      };
    });
})(window, navigator).catch((err) => console.error(err.message));

(async function (window, document, QRious) {
  "use strict";
  // ::: Constants
  const labels = { toTop: "Back to page top" };
  const [undisplayed, transparent] = ["undisplayed", "transparent"];

  // ::: Functions
  const create = (...ee) => ee.map((e) => document.createElement(e));
  const select = (...ee) => ee.map((e) => document.querySelector(e));
  const selectAll = (...ee) => ee.map((e) => [...document.querySelectorAll(e)]);
  const styleOf = (val, fall) => style.getPropertyValue(val) || fall;
  // Highlights a selected container from a group according to a criterion
  const selected = "paged selected";
  const highlight = (group, parent, criterion) => {
    group.forEach((e) => {
      criterion(e) && (e.closest(parent).className = selected);
      e.onclick = (ev) => {
        group
          .map((el) => el.closest(parent))
          .filter((el) => el)
          .forEach((el) => (el.className = ""));
        ev.target.closest(parent).className = selected;
      };
    });
  };

  // ::: Global elements
  // ::: Created
  const [spinner] = create("div");
  spinner.classList.add("spinner");
  // ::: Selected
  const style = getComputedStyle(document.documentElement);
  const [header, main, notes] = select("header", "main", "#notes");
  const [pages, radios] = selectAll("label.paged", "input.paged[type='radio']");

  // ::: Instantiate QR code component
  const [tint1, tint2] = ["--color-primary-tint-3", "--color-secondary-tint-1"];
  const [rawFG, rawBG] = ["#000", "#FFF"];
  const qr = new QRious({
    element: document.getElementById("qr").children[0],
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
  const checkedId = radios.filter((e) => e.checked == true)[0].id;
  highlight(pages, "li", (e) => e.getAttribute("for") === checkedId);

  // ::: Load posts and inject them in each article component
  const loadPosts = async () => {
    const url =
      "https://api.github.com/repos/dhsrocha/dhsrocha.github.io/issues?" +
      "state=closed&labels=blog-post&assignee=dhsrocha";
    const res = await fetch(url);
    const data = await res.json();

    // Posts to articles
    const articles = document.getElementById("articles");
    const sections = data.map((post) => {
      const artId = "article-" + post.number;

      const tags = ["div", "input", "label", "article", "section"];
      const [container, radio, label, art, content] = create(...tags);
      const [header, h3, arrow] = create("header", "h3", "em");
      const [footer, updatedAt, time] = create("footer", "span", "time");

      radio.id = "article-tab__" + post.number;
      radio.classList.add(undisplayed, "paged");
      radio.setAttribute("type", "radio");
      radio.setAttribute("name", "article-tabs");
      label.setAttribute("for", radio.id);

      art.id = artId;
      h3.innerHTML = post.title;
      arrow.classList.add("icons", "icon-arrow-right");
      const toggleRadio = (e) =>
        (e.onclick = () => (radio.checked = !radio.checked));
      [header, content].forEach(toggleRadio);
      content.innerHTML = post.body;

      updatedAt.innerHTML = "Last updated at ";
      const dt = new Date(post.updated_at);
      time.innerHTML = dt.toLocaleDateString() + " " + dt.toLocaleTimeString();

      // TODO: Jump to related posts

      // TODO: Some comment box

      // Appending elements
      label.appendChild(art);
      footer.appendChild(updatedAt);
      updatedAt.appendChild(time);
      [h3, arrow].forEach((e) => header.appendChild(e));
      [header, content, footer].forEach((e) => art.appendChild(e));
      [radio, label].forEach((e) => container.appendChild(e));
      return container;
    });

    // Pages
    const groups = [];
    for (let i = 0; i < sections.length; i += 3) {
      if (i + 3 < sections.length) groups.push(sections.slice(i, i + 3));
      else groups.push(sections.slice(i, sections.length));
    }
    const pageName = "page-tab__";
    const pages = groups
      .map((g) => {
        const page = document.createElement("section");
        g.forEach((e) => page.appendChild(e));
        return page;
      })
      .map((p, i) => {
        const [container, radio] = create("div", "input");
        radio.classList.add("paged");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "page-tabs");
        radio.id = pageName + i;
        i === 0 && (radio.checked = true);
        [radio, p].forEach((e) => container.appendChild(e));
        return container;
      });
    // Pagination
    const pagination = document.createElement("ul");
    pagination.classList.add("horizontal");
    [...Array(pages.length).keys()].map((i) => {
      const [li, label] = create("li", "label");
      label.setAttribute("for", pageName + i);
      label.innerHTML = i + 1;
      li.appendChild(label);
      pagination.appendChild(li);
      return li;
    });
    // Appending elements
    pages.forEach((e) => articles.appendChild(e));
    articles.appendChild(pagination);
    // Display after finished loading.
    articles.style.opacity = 1;
  };
  const preloadPosts = () => {
    notes.appendChild(spinner);
    const resolve = () => notes.removeChild(spinner);
    loadPosts().then(resolve);
  };
  document
    .getElementById("nav-tab__notes")
    .addEventListener("change", preloadPosts, { once: true });

  // ::: Final message
  const [msg, h3, p] = create("div", "h3", "p");
  h3.innerHTML = "I would like to hear you";
  p.innerHTML =
    "Reach me if you have an idea that you want to get it started. " +
    "I would be pleased to help you with something.";
  msg.appendChild(h3);
  msg.appendChild(p);
  main.appendChild(msg);

  // ::: "Back to top" button
  const [toTop, btn, em] = create("a", "button", "em");
  toTop.id = "to-top";
  toTop.classList.add(transparent);
  toTop.setAttribute("href", "#top");
  toTop.setAttribute("aria-label", labels.toTop);
  toTop.setAttribute("title", labels.toTop);
  em.className = "icons icon-arrow-up";
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
  window.onload = () => (document.body.style.opacity = 1);
  // :::
})(window, document, QRious);
