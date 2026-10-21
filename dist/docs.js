// Documentation search: filters docs-index.json as you type. "/" focuses the box.
(function () {
  var q = document.getElementById("docQ"), box = document.getElementById("docHits");
  if (!q || !box) return;
  var data = null, active = -1;
  function load(cb) { if (data) return cb(); fetch("/docs-index.json").then(function (r) { return r.json(); }).then(function (d) { data = d; cb(); }).catch(function () { data = []; cb(); }); }
  function score(it, words) { var s = 0, t = it.t.toLowerCase(), m = it.s.toLowerCase(), x = (it.x || "").toLowerCase(), g = it.g.toLowerCase(); for (var i = 0; i < words.length; i++) { var w = words[i], hit = 0; if (t.indexOf(w) >= 0) hit += 6; if (m.indexOf(w) >= 0) hit += 3; if (g.indexOf(w) >= 0) hit += 1; if (x.indexOf(w) >= 0) hit += 1; if (!hit) return 0; s += hit; } return s; }
  function esc(t) { return t.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function render() {
    var words = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) { box.hidden = true; box.innerHTML = ""; return; }
    var hits = data.map(function (it) { return { it: it, s: score(it, words) }; }).filter(function (h) { return h.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 8);
    box.hidden = false; active = -1;
    box.innerHTML = hits.length ? hits.map(function (h, i) { return '<a role="option" href="' + h.it.u + '" data-i="' + i + '"><b>' + esc(h.it.t) + '</b><span>' + esc(h.it.g) + " — " + esc(h.it.s) + "</span></a>"; }).join("") : '<p class="none">Nothing matches “' + esc(q.value) + "”. Try a shorter word.</p>";
  }
  q.addEventListener("input", function () { load(render); });
  q.addEventListener("focus", function () { load(function () {}); });
  q.addEventListener("keydown", function (e) {
    var items = box.querySelectorAll("a"); if (!items.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(items.length - 1, active + 1); } else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(0, active - 1); } else if (e.key === "Enter" && active >= 0) { e.preventDefault(); items[active].click(); return; } else return;
    items.forEach(function (a, i) { a.classList.toggle("on", i === active); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "/" && document.activeElement !== q && !/input|textarea/i.test((document.activeElement || {}).tagName || "")) { e.preventDefault(); q.focus(); } });
})();
