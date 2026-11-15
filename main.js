(function () {
  var SECTIONS = ["projects", "capabilities", "writing", "background", "contact"];
  var HEADINGS = {
    top: "hero-heading",
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

  function goTop(behavior) {
    var heading = document.getElementById("hero-heading");
    if (window.location.hash !== "#top") {
      window.location.hash = "#top";
    } else {
      window.scrollTo({ top: 0, behavior: behavior });
    }
    focusElement(heading);
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
          focusHeading("top");
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
        launching = false;
        goTop(reducedMotion() ? "auto" : "smooth");
        updateRocket();
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
    if (typeof entry.title !== "string" || entry.title.trim() === "") return null;
    if (!isHttpUrl(entry.url)) return null;
    if (typeof entry.platform !== "string" || entry.platform.trim() === "") return null;
    if (typeof entry.summary !== "string" || entry.summary.trim() === "") return null;
    var formatted = formatDate(entry.date);
    if (!formatted) return null;
    if (entry.featured != null && typeof entry.featured !== "boolean") return null;
    var image = "";
    if (entry.image != null && entry.image !== "") {
      if (!isLocalPostImage(entry.image)) image = "";
      else image = entry.image;
    }
    return {
      title: entry.title.trim(),
      url: entry.url,
      platform: entry.platform.trim(),
      date: entry.date,
      formatted: formatted,
      summary: entry.summary.trim(),
      image: image
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

  function createCard(post) {
    var article = document.createElement("article");
    article.className = "post-card";
    var link = document.createElement("a");
    link.href = post.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    var media = document.createElement("div");
    media.className = "post-media";
    if (post.image) {
      var img = document.createElement("img");
      img.src = post.image;
      img.alt = post.title;
      img.width = 640;
      img.height = 360;
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("error", function () {
        img.replaceWith(createFallback(post.platform));
      });
      media.appendChild(img);
    } else {
      media.appendChild(createFallback(post.platform));
    }

    var copy = document.createElement("div");
    copy.className = "post-copy";
    var meta = document.createElement("p");
    meta.className = "post-meta";
    var platform = document.createElement("span");
    platform.textContent = post.platform;
    var time = document.createElement("time");
    time.dateTime = post.date;
    time.textContent = post.formatted;
    meta.appendChild(platform);
    meta.appendChild(document.createTextNode(" · "));
    meta.appendChild(time);

    var title = document.createElement("h3");
    title.className = "post-title";
    title.textContent = post.title;
    var summary = document.createElement("p");
    summary.className = "post-summary";
    summary.textContent = post.summary;
    copy.appendChild(meta);
    copy.appendChild(title);
    copy.appendChild(summary);
    link.appendChild(media);
    link.appendChild(copy);
    article.appendChild(link);
    return article;
  }

  function initWriting() {
    var empty = document.getElementById("writing-empty");
    var grid = document.getElementById("writing-grid");
    if (!empty || !grid) return;
    fetch("/data/posts.json", { cache: "no-store", headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) throw new Error("posts");
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) return;
        var posts = [];
        for (var i = 0; i < data.length; i += 1) {
          var post = validatePost(data[i]);
          if (post) posts.push(post);
        }
        posts.sort(function (a, b) {
          if (a.date === b.date) return 0;
          return a.date < b.date ? 1 : -1;
        });
        if (posts.length === 0) return;
        var fragment = document.createDocumentFragment();
        for (var j = 0; j < posts.length; j += 1) fragment.appendChild(createCard(posts[j]));
        grid.replaceChildren(fragment);
        empty.hidden = true;
        grid.hidden = false;
        onViewportChange();
      })
      .catch(function () {
        empty.hidden = false;
        grid.hidden = true;
      });
  }

  initTheme();
  initSectionLinks();
  initRocket();
  initShots();
  document.documentElement.classList.add("enhanced");
  initObservers();
  initWriting();
})();
