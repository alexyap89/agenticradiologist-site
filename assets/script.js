/* agenticradiologist — theme, scroll reveal, posts, newsletter stub */
(function () {
  "use strict";

  var root = document.documentElement;
  var motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme toggle ---------- */
  var btn = document.querySelector(".theme-btn");
  function currentTheme() {
    return root.dataset.theme || "light";
  }
  if (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
      btn.setAttribute("aria-pressed", String(next === "dark"));
    });
  }
  btn && btn.setAttribute("aria-pressed", String(currentTheme() === "dark"));
  // Follow OS changes only when the user hasn't chosen manually.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!localStorage.getItem("theme")) root.dataset.theme = e.matches ? "dark" : "light";
  });

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (motionOK && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
  function watchReveals(scope) {
    scope.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
      if (motionOK && "IntersectionObserver" in window) el.classList.add("in"); // already in viewport post-render: just show
    });
  }

  /* ---------- render posts from posts.json ---------- */
  function fmtDate(iso) {
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function cardHTML(p) {
    return (
      '<a class="post reveal" href="' + esc(p.url) + '">' +
      '<div class="post-meta"><time datetime="' + esc(p.date) + '">' + fmtDate(p.date) + "</time>" +
      '<span class="tag">' + esc(p.tag) + "</span></div>" +
      "<h3>" + esc(p.title) + "</h3>" +
      '<p class="excerpt">' + esc(p.excerpt) + "</p>" +
      '<span class="read">Read post →</span>' +
      "</a>"
    );
  }

  /* Embedded copy so the site still renders when fetch is blocked
     (e.g. opening via file://). On Netlify, fetch() wins and picks up
     any posts you add to posts.json. Keep this in sync-ish with posts.json. */
  var FALLBACK_POSTS = [
    {
      "title": "Bone is a database: field notes from a decade of DECT",
      "date": "2026-07-12",
      "excerpt": "Dual-energy CT doesn't hand you an image — it hands you a query result. A decade of DECT in five honest lessons.",
      "tag": "dect",
      "url": "posts/dect-bone-is-a-database.html"
    },
    {
      "title": "The agent fleet: what I actually run on my own hardware",
      "date": "2026-06-08",
      "excerpt": "Five small agents, one Linux box, zero cloud. What they do, what broke, and why the no-patient-data rule is the design.",
      "tag": "agentic-ai",
      "url": "posts/the-agent-fleet.html"
    },
    {
      "title": "A local-first AI stack for a radiologist",
      "date": "2026-04-21",
      "excerpt": "The honest numbers on running a 14B model at home: slower, private, auditable, and yours. The cloud is a subscription to someone else's agent.",
      "tag": "local-ai",
      "url": "posts/local-first-stack.html"
    }
  ];

  async function loadPosts() {
    var grids = document.querySelectorAll("[data-posts]");
    if (!grids.length) return;
    var posts;
    try {
      var res = await fetch("posts.json", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      posts = await res.json();
    } catch (err) {
      posts = FALLBACK_POSTS; // file:// or offline: still show seed posts
    }
    var sorted = posts.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    grids.forEach(function (g) {
      var list = g.dataset.posts === "featured" ? sorted.slice(0, 3) : sorted;
      if (!list.length) {
        g.innerHTML = '<p class="grid-empty">No posts yet.</p>';
        return;
      }
      g.innerHTML = list.map(cardHTML).join("");
      watchReveals(g);
    });
  }
  loadPosts();

  /* ---------- scroll progress bar ---------- */
  var bar = document.querySelector('.scroll-progress');
  if (bar) {
    window.addEventListener('scroll', function () {
      var pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      bar.style.transform = 'scaleX(' + Math.min(pct, 1) + ')';
    }, { passive: true });
  }

  /* ---------- 3D tilt on cards ---------- */
  function initTilt(selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = 'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-6px)';
        el.style.boxShadow = (-x * 12) + 'px ' + (12 + y * 12) + 'px 32px rgba(0,0,0,0.12)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
        el.style.boxShadow = '';
      });
    });
  }
  initTilt('.card, .work, .post');

  /* ---------- newsletter (Buttondown stub) ---------- */
  var form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var btn2 = form.querySelector("button");
      var msg = document.getElementById("newsletter-msg");
      var email = form.email.value.trim();
      if (!email) { msg.textContent = "Enter an email first."; return; }
      btn2.disabled = true;
      var placeholder = form.action.indexOf("YOUR_BUTTONDOWN_USERNAME") !== -1;
      if (placeholder) {
        // Stub: no Buttondown account configured yet.
        msg.textContent = "✓ Looks good — this is a stub. Set your Buttondown username in index.html and it will subscribe for real.";
      } else {
        try {
          var fd = new FormData();
          fd.set("email", email);
          var res = await fetch(form.action, { method: "POST", body: fd, headers: { Accept: "application/json" } });
          msg.textContent = res.ok
            ? "✓ Subscribed. Welcome aboard — see you in your inbox."
            : "Something went wrong on the server side. Please try again, or email alexyap@gmail.com.";
        } catch (err) {
          msg.textContent = "Network error — please try again, or email alexyap@gmail.com.";
        }
      }
      btn2.disabled = false;
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();