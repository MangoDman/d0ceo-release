(function () {
  // hydrate shared app mockups
  Array.prototype.forEach.call(document.querySelectorAll("[data-mock]"), function (el) {
    var html = window.DOCEO_MOCKS && window.DOCEO_MOCKS[el.getAttribute("data-mock")];
    if (html) { el.innerHTML = html; el.classList.add("mock-ready"); }
  });
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;

  // active nav link
  var page = document.body.getAttribute("data-page");
  $$("[data-nav]").forEach(function (a) { if (a.getAttribute("data-nav") === page) { a.classList.add("on"); a.setAttribute("aria-current", "page"); } });

  // sticky nav border
  var nav = $("#nav");
  var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  // mobile menu
  var btn = $("#menuBtn"), links = $("#links");
  btn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (e) { if (e.target.tagName === "A") { links.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { links.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });

  // light / dark
  $("#themeBtn").addEventListener("click", function () {
    var cur = root.getAttribute("data-theme");
    if (!cur) cur = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("doceo-site-theme", next); } catch (e) {}
  });

  // reveal on scroll
  var els = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("in"); }); }

  // mockup theme swatches (hero)
  var swBox = $("[data-swatches]");
  if (swBox) {
    var target = $(swBox.getAttribute("data-swatches"));
    $$(".sw", swBox).forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".sw", swBox).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        $$(".mock").forEach(function (m) { m.setAttribute("data-mt", b.getAttribute("data-mt")); });
      });
    });
  }

  // example tabs
  $$("[data-tabs]").forEach(function (box) {
    var tabs = $$("[role=tab]", box), panels = $$("[role=tabpanel]", box);
    function show(id) {
      tabs.forEach(function (t) { t.setAttribute("aria-selected", t.getAttribute("aria-controls") === id ? "true" : "false"); });
      panels.forEach(function (p) { p.hidden = p.id !== id; });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { show(t.getAttribute("aria-controls")); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { n.focus(); n.click(); e.preventDefault(); }
      });
    });
  });

  // OS detection -> highlight the right download
  var ua = navigator.userAgent, os = /Windows/i.test(ua) ? "win" : /Android/i.test(ua) ? "" : /Linux|X11/i.test(ua) ? "linux" : /Mac/i.test(ua) ? "mac" : "";
  var rec = $("[data-os-label]");
  if (rec && os) rec.textContent = os === "win" ? "Download for Windows" : os === "linux" ? "Download for Linux" : "Download for macOS";
  if (os) $$("[data-dl='" + os + "']").forEach(function (c) { c.style.borderColor = "var(--indigo)"; c.style.boxShadow = "var(--shadow)"; });
})();
