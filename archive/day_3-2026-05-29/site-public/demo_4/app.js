// Demo 4 — "Why is this scroll laggy?"
//
// A scrollable Swiggy-style feed with two scroll handlers you can swap between
// at runtime. The slow handler thrashes layout per scroll event (a class toggle
// per card + a getBoundingClientRect read = forced layout); the fast handler
// reads pre-computed offsets and never touches the DOM. You feel the difference
// by scrolling.
//
// A canary in the topbar (a pulsing dot + frame-interval readout) reflects
// main-thread health. When the slow handler hogs the thread, the canary
// visibly freezes and the frame readout spikes.

const RESTAURANTS = [
  { emoji: "🍛", name: "Meghana Foods", cuisine: "Biryani, Andhra", rating: 4.3, price: 500, eta: "40 mins" },
  { emoji: "🍕", name: "Toit", cuisine: "Pizza, Brewery", rating: 4.5, price: 1200, eta: "45 mins" },
  { emoji: "☕", name: "Truffles", cuisine: "Burgers, American", rating: 4.5, price: 600, eta: "30 mins" },
  { emoji: "🍜", name: "Burma Burma", cuisine: "Burmese, Asian", rating: 4.6, price: 1500, eta: "50 mins" },
  { emoji: "🥘", name: "Nagarjuna", cuisine: "Andhra, South Indian", rating: 4.2, price: 700, eta: "35 mins" },
  { emoji: "🍲", name: "Empire Restaurant", cuisine: "Kebabs, Biryani", rating: 4.1, price: 450, eta: "30 mins" },
  { emoji: "🥞", name: "Vidyarthi Bhavan", cuisine: "South Indian, Dosa", rating: 4.4, price: 250, eta: "25 mins" },
  { emoji: "🍔", name: "Hard Rock Cafe", cuisine: "American, Bar", rating: 4.3, price: 1800, eta: "55 mins" },
  { emoji: "🥗", name: "Smoke House Deli", cuisine: "Cafe, Continental", rating: 4.4, price: 1100, eta: "40 mins" },
  { emoji: "🍦", name: "Corner House", cuisine: "Ice cream, Desserts", rating: 4.6, price: 350, eta: "20 mins" },
  { emoji: "🍞", name: "Glen's Bakehouse", cuisine: "Bakery, Cafe", rating: 4.5, price: 800, eta: "35 mins" },
  { emoji: "🍝", name: "Chinita", cuisine: "Mexican, Tex-Mex", rating: 4.3, price: 950, eta: "45 mins" },
  { emoji: "🥟", name: "Mainland China", cuisine: "Chinese, Asian", rating: 4.1, price: 1300, eta: "50 mins" },
  { emoji: "🍢", name: "Olive Beach", cuisine: "Mediterranean", rating: 4.5, price: 2200, eta: "55 mins" },
  { emoji: "🍛", name: "MTR", cuisine: "South Indian, Sweets", rating: 4.5, price: 400, eta: "30 mins" },
  { emoji: "🫓", name: "Khan Saheb", cuisine: "Mughlai, Kebabs", rating: 4.2, price: 750, eta: "40 mins" },
  { emoji: "🍕", name: "California Pizza Kitchen", cuisine: "Pizza, Italian", rating: 4.0, price: 1400, eta: "45 mins" },
  { emoji: "🥩", name: "Hotel Sadanand", cuisine: "Andhra, Biryani", rating: 4.0, price: 350, eta: "30 mins" },
  { emoji: "🍤", name: "Karavalli", cuisine: "Coastal, Seafood", rating: 4.7, price: 2500, eta: "60 mins" },
  { emoji: "🍰", name: "Maverick & Farmer", cuisine: "Cafe, Coffee", rating: 4.4, price: 700, eta: "35 mins" },
  { emoji: "🥪", name: "Smally's", cuisine: "Sandwiches, Subs", rating: 4.2, price: 450, eta: "25 mins" },
  { emoji: "🍣", name: "Indigo Deli", cuisine: "Cafe, Continental", rating: 4.3, price: 1200, eta: "45 mins" },
  { emoji: "🍩", name: "Mad Over Donuts", cuisine: "Desserts, Bakery", rating: 4.2, price: 400, eta: "25 mins" },
  { emoji: "🍪", name: "Theobroma", cuisine: "Bakery, Desserts", rating: 4.5, price: 550, eta: "30 mins" },
  { emoji: "🌯", name: "California Burrito", cuisine: "Mexican", rating: 4.0, price: 500, eta: "30 mins" },
  { emoji: "🍱", name: "Edo", cuisine: "Japanese, Sushi", rating: 4.4, price: 2200, eta: "55 mins" },
  { emoji: "🧆", name: "Plan B", cuisine: "American, Bar", rating: 4.2, price: 1000, eta: "45 mins" },
  { emoji: "🥧", name: "Big Pitcher", cuisine: "Continental, Bar", rating: 4.0, price: 1700, eta: "50 mins" },
  { emoji: "🍚", name: "A2B", cuisine: "South Indian", rating: 4.1, price: 350, eta: "25 mins" },
  { emoji: "🍜", name: "Bombay Brasserie", cuisine: "North Indian", rating: 4.3, price: 1300, eta: "50 mins" },
  { emoji: "🥯", name: "Brik Oven", cuisine: "Pizza, Italian", rating: 4.3, price: 800, eta: "40 mins" },
  { emoji: "🍮", name: "Anand Sweets", cuisine: "Sweets, Snacks", rating: 4.4, price: 200, eta: "20 mins" },
  { emoji: "☕", name: "Brahmin's Coffee Bar", cuisine: "South Indian, Filter Coffee", rating: 4.6, price: 150, eta: "20 mins" },
  { emoji: "🍛", name: "CTR (Central Tiffin Room)", cuisine: "Dosa, South Indian", rating: 4.5, price: 250, eta: "25 mins" },
  { emoji: "🫖", name: "Mavalli Tiffin Room", cuisine: "South Indian, Sweets", rating: 4.4, price: 300, eta: "25 mins" },
  { emoji: "🍢", name: "Vinayaka Mylari", cuisine: "Mysore Masala Dosa", rating: 4.6, price: 200, eta: "20 mins" },
  { emoji: "🥘", name: "Shanthi Sagar", cuisine: "South Indian", rating: 4.0, price: 300, eta: "25 mins" },
  { emoji: "🍵", name: "Sukh Sagar", cuisine: "North Indian, Chinese", rating: 3.9, price: 400, eta: "30 mins" },
  { emoji: "🍞", name: "Iyengar Bakery", cuisine: "Bakery, Snacks", rating: 4.2, price: 200, eta: "20 mins" },
  { emoji: "🥟", name: "Hotel Bheema's", cuisine: "Andhra Meals", rating: 4.1, price: 400, eta: "30 mins" },
];

const feedEl = document.getElementById("feed");
const aboveCountEl = document.getElementById("above-count");
const totalCountEl = document.getElementById("total-count");
const modeSlowBtn = document.getElementById("mode-slow");
const modeFastBtn = document.getElementById("mode-fast");
const canaryEl = document.getElementById("canary");
const frameReadoutEl = document.getElementById("frame-readout");
const handlerReadoutEl = document.getElementById("handler-readout");
const autoScrollBtn = document.getElementById("auto-scroll");

// ---- Build the cards ------------------------------------------------------
//
// We need enough cards that the slow handler genuinely blows past the 16.7 ms
// frame budget on a modern laptop. 40 cards was borderline (~8 ms per scroll
// event); 120 puts the slow handler at ~30+ ms per event — clearly above the
// budget, so frames drop and the canary visibly freezes.

const CARDS_PER_LIST = 120;
const cardData = [];
for (let i = 0; i < CARDS_PER_LIST; i++) {
  // Cycle through the hand-curated list to fill out the feed. Real Swiggy
  // results would be unique; the repetition is fine for a teaching demo.
  cardData.push(RESTAURANTS[i % RESTAURANTS.length]);
}

function buildCard(r) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="card__pic" aria-hidden="true">${r.emoji}</div>
    <div class="card__body">
      <p class="card__name">${r.name}</p>
      <p class="card__cuisine">${r.cuisine}</p>
      <p class="card__meta"><span class="rating">★ ${r.rating}</span> · ${r.eta} · ₹${r.price} for two</p>
    </div>
  `;
  return card;
}

const cards = cardData.map(buildCard);
cards.forEach((c) => feedEl.appendChild(c));
totalCountEl.textContent = cards.length;

// ---- The slow scroll handler ---------------------------------------------
//
// For every card: write a sub-pixel margin tied to window.scrollY (guaranteed
// to invalidate layout because the value genuinely changes on every scroll
// event), then read getBoundingClientRect() (forced layout flush).
//
// 120 cards × ~0.3 ms per forced layout = ~30+ ms per scroll event. Way past
// the 16.7 ms frame budget. Frames drop, the canary visibly freezes, and the
// handler readout climbs into the 30–60 ms range.
//
// The sub-pixel marginRight (always < 0.1 px) is visually invisible — the
// cards don't shift — but the browser still has to redo layout because the
// value is different. This is the "no-op write" trick that defeats any engine
// optimisation that would otherwise skip layout when the value hasn't changed.

// Inner-loop multiplier: how many write-read cycles to do per card per scroll
// event. 5 gives ~600 forced layouts per scroll event on 120 cards, which is
// enough to blow past the 16 ms frame budget by an order of magnitude.
const INNER_THRASH = 5;

function onScrollSlow() {
  const start = performance.now();
  const sy = window.scrollY;
  let above = 0;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    // Inner loop: each round writes a NEW padding value (guaranteed layout
    // invalidation — padding affects content width and forces text reflow)
    // then reads getBoundingClientRect (forced flush). Browsers can't elide
    // padding changes the way they sometimes elide sub-pixel margin.
    for (let j = 0; j < INNER_THRASH; j++) {
      // Build a padding value that's always different across (i, j, sy) but
      // visually identical (rounds to the same pixel).
      const padPx = 11 + ((sy + i * 7 + j * 13) % 100) * 0.001;
      card.style.paddingRight = padPx.toFixed(4) + "px";
      // Forced layout flush
      card.getBoundingClientRect();
    }
    if (card.offsetTop + card.offsetHeight < sy) above++;
  }
  aboveCountEl.textContent = above;
  reportHandlerTime(performance.now() - start);
}

// ---- The fast scroll handler ---------------------------------------------
//
// Each card's top + height is computed ONCE up front and cached in a plain
// array. The scroll handler reads window.scrollY (one value) and does pure JS
// arithmetic. Zero DOM reads. Zero forced layouts. The scroll handler runs in
// microseconds, the frame budget stays intact, and the canary stays smooth.

let cachedBottoms = [];
function recomputeOffsets() {
  // Single batched read pass — all the layout math we'll ever need.
  cachedBottoms = cards.map((c) => c.offsetTop + c.offsetHeight);
}

function onScrollFast() {
  const start = performance.now();
  const scrollY = window.scrollY;
  let above = 0;
  for (let i = 0; i < cachedBottoms.length; i++) {
    if (cachedBottoms[i] < scrollY) above++;
  }
  aboveCountEl.textContent = above;
  reportHandlerTime(performance.now() - start);
}

// Direct readout of how long the most recent scroll handler took. Easier to
// read than the per-frame interval — when slow mode is wedged at 35 ms while
// fast mode shows 0.0 ms, the lesson lands without needing to feel the jank.
function reportHandlerTime(ms) {
  handlerReadoutEl.textContent = `handler: ${ms.toFixed(1)} ms`;
  if (ms > 8) handlerReadoutEl.classList.add("topbar__frame--lag");
  else handlerReadoutEl.classList.remove("topbar__frame--lag");
}

// ---- Mode toggle ----------------------------------------------------------

let currentHandler = null;

function setMode(mode) {
  if (currentHandler) window.removeEventListener("scroll", currentHandler);
  if (mode === "slow") {
    currentHandler = onScrollSlow;
    modeSlowBtn.classList.add("modepick__btn--active");
    modeFastBtn.classList.remove("modepick__btn--active");
  } else {
    recomputeOffsets();
    currentHandler = onScrollFast;
    modeFastBtn.classList.add("modepick__btn--active");
    modeSlowBtn.classList.remove("modepick__btn--active");
  }
  window.addEventListener("scroll", currentHandler, { passive: true });
  currentHandler();
}

modeSlowBtn.addEventListener("click", () => setMode("slow"));
modeFastBtn.addEventListener("click", () => setMode("fast"));

window.addEventListener("resize", () => {
  // Heights might have changed; if fast mode is active, refresh the cache.
  recomputeOffsets();
});

// ---- Auto-scroll ----------------------------------------------------------
//
// Hands-free way to feel the difference without the user having to throw
// their trackpad. Animates window.scrollY from current to bottom and back,
// firing real scroll events the whole way down. The slow handler will run
// hundreds of times during the animation; the canary freezes for the whole
// trip in slow mode, and stays smooth in fast.

let autoScrollRaf = null;
function runAutoScroll() {
  if (autoScrollRaf !== null) {
    cancelAnimationFrame(autoScrollRaf);
    autoScrollRaf = null;
    autoScrollBtn.textContent = "Auto-scroll";
    return;
  }
  autoScrollBtn.textContent = "Stop";
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const startY = window.scrollY;
  const startT = performance.now();
  const DURATION_MS = 4000; // down then back up
  function step(now) {
    const t = (now - startT) / DURATION_MS; // 0..1..2
    if (t >= 2) {
      window.scrollTo(0, startY);
      autoScrollRaf = null;
      autoScrollBtn.textContent = "Auto-scroll";
      return;
    }
    // Triangle wave: 0 → 1 → 0 over [0, 2]
    const ease = t < 1 ? t : 2 - t;
    window.scrollTo(0, ease * max);
    autoScrollRaf = requestAnimationFrame(step);
  }
  autoScrollRaf = requestAnimationFrame(step);
}
autoScrollBtn.addEventListener("click", runAutoScroll);

// ---- Canary ---------------------------------------------------------------
//
// JS-driven spinner: every requestAnimationFrame tick, rotate the inner mark
// by 12°. At 60 fps that's a full rotation every 0.5s — fast enough to be
// obviously continuous. When the main thread is blocked, rAF doesn't fire,
// so the spinner FREEZES mid-rotation. Resumes when the handler unblocks.
// Far more visible than a setTimeout-driven pulse.

let spinAngle = 0;
let lastFrame = performance.now();
function tickFrame(now) {
  const delta = now - lastFrame;
  lastFrame = now;
  spinAngle = (spinAngle + 12) % 360;
  canaryEl.style.transform = `rotate(${spinAngle}deg)`;
  frameReadoutEl.textContent = `last frame: ${delta.toFixed(0)} ms`;
  if (delta > 30) {
    frameReadoutEl.classList.add("topbar__frame--lag");
    canaryEl.classList.add("canary--lag");
  } else {
    frameReadoutEl.classList.remove("topbar__frame--lag");
    canaryEl.classList.remove("canary--lag");
  }
  requestAnimationFrame(tickFrame);
}
requestAnimationFrame(tickFrame);

// Default to slow mode so the lesson lands immediately on load.
setMode("slow");
