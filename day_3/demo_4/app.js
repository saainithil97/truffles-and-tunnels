// Demo 4 — the expensive DOM.
//
// We build 500 restaurant tiles, then resize them two ways:
//   - "slow": loop over every tile, set its size inline, and READ a layout
//     property each iteration so the browser is forced to recompute layout
//     synchronously 500 times (layout thrash).
//   - "fast": toggle ONE class on the grid container; CSS resizes every tile
//     in a single layout + paint.
// Both produce the same look. The timings show the difference.

const TILE_COUNT = 500;

// A few food emoji + short names, cycled across the tiles.
const FOODS = [
  ["🍕", "Pizza"],
  ["🍔", "Burger"],
  ["🍛", "Biryani"],
  ["🍜", "Noodles"],
  ["🥗", "Salad"],
  ["🍣", "Sushi"],
  ["🌮", "Tacos"],
  ["🍩", "Donut"],
  ["🍦", "Softy"],
  ["☕", "Coffee"],
];

const grid = document.getElementById("grid");
const slowTimeEl = document.getElementById("slow-time");
const fastTimeEl = document.getElementById("fast-time");

// The "slow" path resizes by writing inline styles per tile, so it needs the
// container in its base (small) state to have something to grow toward.
const BIG = { width: "88px", height: "88px", fontSize: "34px" };
const SMALL = { width: "56px", height: "56px", fontSize: "22px" };

function buildTiles() {
  grid.classList.remove("big");
  const frag = document.createDocumentFragment();
  for (let i = 0; i < TILE_COUNT; i++) {
    const [emoji, name] = FOODS[i % FOODS.length];
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.innerHTML = `<span class="emoji">${emoji}</span><span class="name">${name}</span>`;
    frag.appendChild(tile);
  }
  grid.replaceChildren(frag);
}

function fmt(ms) {
  return ms.toFixed(1) + " ms";
}

// SLOW: mutate each tile, and force a synchronous layout each iteration by
// reading offsetWidth right after writing. This is the classic layout-thrash
// anti-pattern — 500 write-then-read cycles, each making the browser reflow.
function resizeEachSlow() {
  const tiles = grid.querySelectorAll(".tile");
  const start = performance.now();
  for (const tile of tiles) {
    tile.style.width = BIG.width;
    tile.style.height = BIG.height;
    tile.style.fontSize = BIG.fontSize;
    // Reading a layout property forces the browser to flush a reflow NOW,
    // before the loop continues. Remove this read and the writes would batch.
    // eslint-disable-next-line no-unused-expressions
    tile.offsetWidth;
  }
  const elapsed = performance.now() - start;
  slowTimeEl.textContent = fmt(elapsed);
}

// FAST: one class toggle. CSS does the resize for all 500 tiles in a single
// layout + paint. (Clear any inline sizes a previous slow run left behind, so
// the class wins and the visual result matches.)
function resizeAllFast() {
  const tiles = grid.querySelectorAll(".tile");
  const start = performance.now();
  for (const tile of tiles) {
    tile.style.width = "";
    tile.style.height = "";
    tile.style.fontSize = "";
  }
  grid.classList.add("big");
  // One read at the end forces the single layout to happen inside our timer.
  grid.offsetWidth;
  const elapsed = performance.now() - start;
  fastTimeEl.textContent = fmt(elapsed);
}

function reset() {
  buildTiles();
  slowTimeEl.textContent = "—";
  fastTimeEl.textContent = "—";
}

document.getElementById("slow").addEventListener("click", resizeEachSlow);
document.getElementById("fast").addEventListener("click", resizeAllFast);
document.getElementById("reset").addEventListener("click", reset);

buildTiles();
