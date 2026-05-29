// Demo 3: a deliberately slow script. It blocks the main thread with a ~2s
// synchronous busy-loop — no network needed, so the block is guaranteed. While
// this loop runs, the browser can do nothing else: no parsing, no painting, no
// clicks. That is what "render-blocking" feels like.
(function () {
  var BLOCK_MS = 2000;
  var start = Date.now();
  console.log("[slow.js] started — blocking for " + BLOCK_MS + "ms");

  // Spin until BLOCK_MS has elapsed. (A real page would never do this on
  // purpose; we do it to simulate a heavy synchronous script.)
  while (Date.now() - start < BLOCK_MS) {
    /* burn CPU */
  }

  var took = Date.now() - start;
  console.log("[slow.js] finished after " + took + "ms");

  function addBanner() {
    var d = document.createElement("div");
    d.className = "done";
    d.textContent = "✓ slow.js finished after " + took + "ms";
    document.body.appendChild(d);
  }

  // When this runs in <head>, <body> doesn't exist yet — wait for it. Otherwise
  // (end of body, or defer) the body is ready, so add the banner now.
  if (document.body) {
    addBanner();
  } else {
    document.addEventListener("DOMContentLoaded", addBanner);
  }
})();
