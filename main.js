(function () {
  var SECTIONS = ["projects", "capabilities", "writing", "background", "contact"];
  var HEADINGS = {
    hero: "hero-heading",
    projects: "projects-heading",
    capabilities: "capabilities-heading",
    writing: "writing-heading",
    background: "background-heading",
    contact: "contact-heading"
  };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var themeButton = document.getElementById("theme-toggle");
  var rocket = document.getElementById("rocket");
  var rocketSvg = rocket ? rocket.querySelector("svg") : null;
  var launching = false;
  var schemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function themeSource() {
    return document.documentElement.getAttribute("data-theme-source") || "system";
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme, source) {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-theme-source", source);
    document.documentElement.style.colorScheme = theme;
    if (!themeButton) return;
    var toDark = theme !== "dark";
    themeButton.setAttribute("aria-label", toDark ? "Switch to dark mode" : "Switch to light mode");
  }

  function initTheme() {
    applyTheme(currentTheme(), themeSource());
    if (typeof schemeQuery.addEventListener === "function") {
      schemeQuery.addEventListener("change", function (event) {
        if (themeSource() === "manual") return;
        applyTheme(event.matches ? "dark" : "light", "system");
      });
    }
    if (!themeButton) return;
    themeButton.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
      } catch (error) {
        /* Storage can be blocked. The choice still applies for this view. */
      }
      applyTheme(next, "manual");
    });
  }

  function headerHeight() {
    var header = document.querySelector(".site-header");
    return header ? header.offsetHeight : 0;
  }

  function syncHeaderHeight() {
    var next = headerHeight() + "px";
    if (document.documentElement.style.getPropertyValue("--header-h") !== next) {
      document.documentElement.style.setProperty("--header-h", next);
    }
  }

  function focusElement(element) {
    if (!element) return;
    try {
      element.focus({ preventScroll: true });
    } catch (error) {
      element.focus();
    }
  }

  function setActive(id) {
    var links = document.querySelectorAll("[data-nav]");
    for (var i = 0; i < links.length; i += 1) {
      if (id && links[i].getAttribute("data-nav") === id) {
        links[i].setAttribute("aria-current", "location");
      } else {
        links[i].removeAttribute("aria-current");
      }
    }
  }

  function updateActive() {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY;
    if (maxScroll > 8 && y >= maxScroll - 4) {
      setActive("contact");
      return;
    }
    var marker = y + headerHeight() + 16;
    var current = null;
    for (var i = 0; i < SECTIONS.length; i += 1) {
      var section = document.getElementById(SECTIONS[i]);
      if (!section) continue;
      var top = section.getBoundingClientRect().top + y;
      if (top <= marker) current = SECTIONS[i];
    }
    setActive(current);
  }

  function rocketWanted() {
    var scrolled = window.scrollY >= window.innerHeight - 1;
    var remaining = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    return scrolled && remaining <= 240;
  }

  function updateRocket() {
    if (!rocket) return;
    var focused = document.activeElement === rocket;
    var show = rocketWanted() || focused || launching;
    rocket.hidden = !show;
  }

  function focusHeading(id) {
    var headingId = HEADINGS[id];
    focusElement(headingId ? document.getElementById(headingId) : null);
  }

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function heroScrollTarget() {
    var section = document.getElementById("hero");
    if (!section) return 0;
    var margin = parseFloat(window.getComputedStyle(section).scrollMarginTop) || 0;
    var target = section.getBoundingClientRect().top + window.scrollY - margin;
    return target > 0 ? target : 0;
  }

  function landAtHero() {
    document.documentElement.style.scrollBehavior = "";
    window.scrollTo({ top: heroScrollTarget(), behavior: "auto" });
    if (window.location.hash !== "#hero") {
      window.history.pushState(null, "", "#hero");
    }
    focusElement(document.getElementById("hero-heading"));
    launching = false;
    rocket.hidden = true;
    rocket.classList.remove("is-launching");
    rocket.style.transform = "";
  }

  function flyHome() {
    var startY = window.scrollY;
    var target = heroScrollTarget();
    var travel = rocket.getBoundingClientRect().top + rocket.offsetHeight + 16;
    var duration = 860;
    var started = window.performance.now();
    document.documentElement.style.scrollBehavior = "auto";
    rocket.classList.add("is-launching");

    function frame(now) {
      var t = (now - started) / duration;
      if (t > 1) t = 1;
      var eased = 1 - Math.pow(1 - t, 3);
      window.scrollTo({
        top: startY + (target - startY) * eased,
        behavior: "auto"
      });
      rocket.style.transform = "translate3d(0, " + (-travel * eased).toFixed(2) + "px, 0)";
      if (t < 1) {
        window.requestAnimationFrame(frame);
        return;
      }
      landAtHero();
    }

    window.requestAnimationFrame(frame);
  }

  function initRocket() {
    if (!rocket || !rocketSvg) return;
    rocket.addEventListener("focus", updateRocket);
    rocket.addEventListener("blur", function () {
      window.requestAnimationFrame(updateRocket);
    });
    rocket.addEventListener("click", function (event) {
      if (reducedMotion()) {
        window.setTimeout(function () {
          focusHeading("hero");
        }, 0);
        return;
      }
      if (launching) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      launching = true;
      updateRocket();
      rocketSvg.classList.add("is-shaking");
      window.setTimeout(function () {
        rocketSvg.classList.remove("is-shaking");
        if (!launching) return;
        flyHome();
      }, 160);
    });
  }

  function revealHeaderLink(link) {
    var nav = link.closest(".header-sections");
    if (!nav) return;
    var linkBox = link.getBoundingClientRect();
    var navBox = nav.getBoundingClientRect();
    var pad = 6;
    var delta = 0;
    if (linkBox.left - pad < navBox.left) delta = linkBox.left - pad - navBox.left;
    else if (linkBox.right + pad > navBox.right) delta = linkBox.right + pad - navBox.right;
    if (delta !== 0) nav.scrollLeft += delta;
  }

  function initSectionLinks() {
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i += 1) {
      if (links[i] === rocket) continue;
      links[i].addEventListener("click", function (event) {
        var href = event.currentTarget.getAttribute("href");
        if (!href || href.charAt(0) !== "#") return;
        window.setTimeout(function () {
          if (href === "#content") {
            focusElement(document.getElementById("content"));
            return;
          }
          focusHeading(href.slice(1));
        }, 0);
      });
    }
    var headerLinks = document.querySelectorAll(".header-sections a");
    for (var j = 0; j < headerLinks.length; j += 1) {
      headerLinks[j].addEventListener("focus", function (event) {
        revealHeaderLink(event.currentTarget);
      });
    }
  }

  function onViewportChange() {
    syncHeaderHeight();
    updateActive();
    updateRocket();
  }

  function initObservers() {
    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("hashchange", onViewportChange);
    window.addEventListener("load", onViewportChange);
    document.addEventListener("toggle", function (event) {
      if (event.target && event.target.tagName === "DETAILS") onViewportChange();
    }, true);
    if (typeof window.ResizeObserver === "function") {
      var observer = new ResizeObserver(onViewportChange);
      observer.observe(document.body);
    }
    onViewportChange();
  }

  function initShots() {
    var images = document.querySelectorAll(".project-shot img");
    for (var i = 0; i < images.length; i += 1) {
      images[i].addEventListener("error", function (event) {
        var figure = event.currentTarget.closest("figure");
        if (figure) figure.remove();
      });
    }
  }

  function initShotDialogs() {
    var links = document.querySelectorAll("[data-shot-open]");
    for (var i = 0; i < links.length; i += 1) {
      links[i].addEventListener("click", function (event) {
        var id = event.currentTarget.getAttribute("data-shot-open");
        var dialog = id ? document.getElementById(id) : null;
        if (!dialog || typeof dialog.showModal !== "function") return;
        event.preventDefault();
        dialog.showModal();
      });
    }
    var dialogs = document.querySelectorAll("dialog.shot-dialog");
    for (var j = 0; j < dialogs.length; j += 1) {
      dialogs[j].addEventListener("click", function (event) {
        if (event.target === event.currentTarget) event.currentTarget.close();
      });
    }
  }

  function isHttpUrl(value) {
    if (typeof value !== "string") return false;
    try {
      var url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
      return false;
    }
  }

  function isLocalPostImage(value) {
    return typeof value === "string" && /^\/assets\/img\/posts\/[A-Za-z0-9._-]+$/.test(value);
  }

  function isPostId(value) {
    return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  }

  function svgNode(name, attrs) {
    var node = document.createElementNS("http://www.w3.org/2000/svg", name);
    var key;
    for (key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) node.setAttribute(key, attrs[key]);
    }
    return node;
  }

  function formatDate(iso) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!match) return "";
    var year = Number(match[1]);
    var month = Number(match[2]);
    var day = Number(match[3]);
    if (month < 1 || month > 12) return "";
    var utc = new Date(Date.UTC(year, month - 1, day));
    if (utc.getUTCFullYear() !== year || utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) {
      return "";
    }
    return day + " " + MONTHS[month - 1] + " " + year;
  }

  function validatePost(entry) {
    if (!entry || typeof entry !== "object") return null;
    if (!isPostId(entry.id)) return null;
    if (typeof entry.title !== "string" || entry.title.trim() === "") return null;
    if (typeof entry.summary !== "string" || entry.summary.trim() === "") return null;
    var formatted = formatDate(entry.date);
    if (!formatted) return null;
    if (entry.featured != null && typeof entry.featured !== "boolean") return null;
    var status = entry.status == null || entry.status === "" ? "published" : entry.status;
    if (status !== "coming-soon" && status !== "published") return null;
    var url = "";
    var platform = "";
    if (status === "published") {
      if (!isHttpUrl(entry.url)) return null;
      if (typeof entry.platform !== "string" || entry.platform.trim() === "") return null;
      url = entry.url;
      platform = entry.platform.trim();
    }
    var image = "";
    if (entry.image != null && entry.image !== "") {
      if (isLocalPostImage(entry.image)) image = entry.image;
    }
    return {
      id: entry.id,
      title: entry.title.trim(),
      url: url,
      platform: platform,
      date: entry.date,
      formatted: formatted,
      summary: entry.summary.trim(),
      image: image,
      status: status
    };
  }

  function createFallback(platform) {
    var block = document.createElement("div");
    block.className = "post-fallback";
    var label = document.createElement("span");
    label.textContent = platform;
    block.appendChild(label);
    return block;
  }

  function createCover(post) {
    var seed = 0;
    var i;
    for (i = 0; i < post.id.length; i += 1) seed += post.id.charCodeAt(i);
    var titleWidth = 96 + (seed % 48);
    var lines = [150 + (seed % 40), 132 + (seed % 28), 118 + ((seed * 3) % 36)];
    var svg = svgNode("svg", { viewBox: "0 0 320 200", class: "post-cover", "aria-hidden": "true" });
    var defs = svgNode("defs", {});
    var clip = svgNode("clipPath", { id: "cover-clip-" + post.id });
    clip.appendChild(svgNode("rect", { width: "320", height: "200" }));
    defs.appendChild(clip);
    svg.appendChild(defs);
    svg.setAttribute("clip-path", "url(#cover-clip-" + post.id + ")");
    svg.appendChild(svgNode("rect", { width: "320", height: "200", fill: "var(--placeholder-bg)" }));
    svg.appendChild(svgNode("rect", {
      x: "26", y: "20", width: "268", height: "160", rx: "8",
      fill: "var(--surface)", stroke: "var(--border)"
    }));
    if (seed % 3 === 1) {
      svg.appendChild(svgNode("rect", { x: "44", y: "40", width: "22", height: "22", rx: "4", fill: "currentColor", opacity: "0.18" }));
      svg.appendChild(svgNode("rect", { x: "76", y: "46", width: String(titleWidth), height: "10", rx: "2", fill: "currentColor", opacity: "0.8" }));
    } else if (seed % 3 === 2) {
      svg.appendChild(svgNode("rect", { x: "40", y: "36", width: "8", height: "128", rx: "2", fill: "currentColor", opacity: "0.18" }));
      svg.appendChild(svgNode("rect", { x: "60", y: "42", width: String(titleWidth), height: "12", rx: "2", fill: "currentColor", opacity: "0.8" }));
    } else {
      svg.appendChild(svgNode("rect", { x: "46", y: "42", width: String(titleWidth), height: "12", rx: "2", fill: "currentColor", opacity: "0.8" }));
      svg.appendChild(svgNode("rect", { x: "46", y: "62", width: "72", height: "7", rx: "2", fill: "currentColor", opacity: "0.35" }));
    }
    for (i = 0; i < lines.length; i += 1) {
      svg.appendChild(svgNode("rect", {
        x: seed % 3 === 2 ? "60" : "46",
        y: String(88 + i * 16),
        width: String(lines[i]),
        height: "6",
        rx: "2",
        fill: "currentColor",
        opacity: "0.22"
      }));
    }
    var stamp = svgNode("g", { transform: "rotate(-28 160 100)" });
    stamp.appendChild(svgNode("rect", { x: "-20", y: "70", width: "360", height: "58", fill: "var(--text)", opacity: "0.08" }));
    var word = svgNode("text", {
      x: "160",
      y: "112",
      "text-anchor": "middle",
      fill: "currentColor",
      "font-size": "52",
      "font-family": "-apple-system, BlinkMacSystemFont, sans-serif",
      "font-weight": "600",
      opacity: "0.78"
    });
    word.textContent = "placeholder";
    stamp.appendChild(word);
    svg.appendChild(stamp);
    return svg;
  }

  function createCard(post) {
    var article = document.createElement("article");
    article.className = "post-card";
    var control;
    if (post.status === "coming-soon") {
      control = document.createElement("button");
      control.type = "button";
      control.addEventListener("click", function () { openWritingNote(post); });
    } else {
      control = document.createElement("a");
      control.href = post.url;
      control.target = "_blank";
      control.rel = "noopener noreferrer";
    }

    var media = document.createElement("div");
    media.className = "post-media";
    if (post.image) {
      var img = document.createElement("img");
      img.src = post.image;
      img.alt = post.title;
      img.width = 320;
      img.height = 200;
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("error", function () {
        img.replaceWith(post.status === "coming-soon" ? createCover(post) : createFallback(post.platform));
      });
      media.appendChild(img);
    } else if (post.status === "coming-soon") {
      media.appendChild(createCover(post));
    } else {
      media.appendChild(createFallback(post.platform));
    }

    var copy = document.createElement("div");
    copy.className = "post-copy";
    var meta = document.createElement("p");
    meta.className = "post-meta";
    var time = document.createElement("time");
    time.dateTime = post.date;
    time.textContent = post.formatted;
    if (post.status === "published") {
      var platform = document.createElement("span");
      platform.textContent = post.platform;
      meta.appendChild(platform);
      meta.appendChild(document.createTextNode(" · "));
    }
    meta.appendChild(time);
    if (post.status === "coming-soon") {
      var soon = document.createElement("span");
      soon.className = "post-soon";
      soon.textContent = "Coming soon";
      meta.appendChild(soon);
    }

    var title = document.createElement("h3");
    title.className = "post-title";
    title.textContent = post.title;
    var summary = document.createElement("p");
    summary.className = "post-summary";
    summary.textContent = post.summary;
    copy.appendChild(meta);
    copy.appendChild(title);
    copy.appendChild(summary);
    control.appendChild(media);
    control.appendChild(copy);
    article.appendChild(control);
    return article;
  }

  function openWritingNote(post) {
    var dialog = document.getElementById("writing-dialog");
    var meta = document.getElementById("writing-dialog-meta");
    var title = document.getElementById("writing-dialog-title");
    var summary = document.getElementById("writing-dialog-summary");
    if (!dialog || !meta || !title || !summary || typeof dialog.showModal !== "function") return;
    meta.textContent = post.formatted + " · Coming soon";
    title.textContent = post.title;
    summary.textContent = post.summary;
    dialog.showModal();
  }

  function initWriting() {
    var empty = document.getElementById("writing-empty");
    var grid = document.getElementById("writing-grid");
    var more = document.getElementById("writing-more");
    var moreButton = document.getElementById("writing-more-button");
    var dialog = document.getElementById("writing-dialog");
    if (!empty || !grid || !more || !moreButton) return;
    if (dialog) {
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) dialog.close();
      });
    }
    fetch("/data/posts.json", { cache: "no-store", headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) throw new Error("posts");
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) return;
        var posts = [];
        var seen = {};
        for (var i = 0; i < data.length; i += 1) {
          var post = validatePost(data[i]);
          if (!post || seen[post.id]) continue;
          seen[post.id] = true;
          posts.push(post);
        }
        posts.sort(function (a, b) {
          if (a.date === b.date) return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
          return a.date < b.date ? 1 : -1;
        });
        if (posts.length === 0) return;
        var shown = 0;
        var pageSize = 3;
        function syncMore() {
          more.hidden = posts.length <= pageSize;
          moreButton.textContent = shown >= posts.length ? "Show less" : "Load more";
          moreButton.setAttribute("aria-expanded", shown > pageSize ? "true" : "false");
        }
        function reveal() {
          var next = Math.min(shown + pageSize, posts.length);
          var fragment = document.createDocumentFragment();
          for (var j = shown; j < next; j += 1) fragment.appendChild(createCard(posts[j]));
          grid.appendChild(fragment);
          shown = next;
          syncMore();
          onViewportChange();
        }
        function collapse() {
          var cards = grid.querySelectorAll(".post-card");
          var i;
          for (i = cards.length - 1; i >= pageSize; i -= 1) cards[i].remove();
          shown = Math.min(pageSize, posts.length);
          syncMore();
          onViewportChange();
          var reduce = false;
          try {
            reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          } catch (error) {}
          more.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
        }
        moreButton.addEventListener("click", function () {
          if (shown >= posts.length) collapse();
          else reveal();
        });
        empty.hidden = true;
        grid.hidden = false;
        reveal();
      })
      .catch(function () {
        empty.hidden = false;
        grid.hidden = true;
        more.hidden = true;
      });
  }

  initTheme();
  initSectionLinks();
  initRocket();
  initShots();
  initShotDialogs();
  document.documentElement.classList.add("enhanced");
  initObservers();
  initWriting();
})();
