// Tiny SPA router — vanilla JS, no framework.
// Demonstrates: pushState, popstate, click interception, view swap.
// Routing is via ?view=home|restaurant|cart so the static server still serves
// index-spa.html on a refresh.

const VIEWS = {
  home: () => `
    <h2>Restaurants near you</h2>
    <p>Every click below is intercepted by JavaScript. The URL changes, but no new HTML is fetched.</p>
    <ul class="restaurants">
      <li><a href="?view=restaurant" data-link>
        <div class="r-name">Meghana Foods</div>
        <div class="r-meta">★ 4.3 · Biryani, Andhra · 40 mins</div>
      </a></li>
      <li><a href="?view=restaurant" data-link>
        <div class="r-name">Truffles</div>
        <div class="r-meta">★ 4.5 · American · 30 mins</div>
      </a></li>
      <li><a href="?view=restaurant" data-link>
        <div class="r-name">Burma Burma</div>
        <div class="r-meta">★ 4.6 · Burmese · 45 mins</div>
      </a></li>
    </ul>`,
  restaurant: () => `
    <div class="detail">
      <h2>Meghana Foods</h2>
      <p>★ 4.3 · Biryani, Andhra · 40 mins · ₹500 for two</p>
      <p>Famous for Andhra-style biryani. Don't skip the boneless chicken biryani.</p>
    </div>
    <p style="margin-top:16px;color:#666;font-size:13px;">
      Network tab: silent. We swapped innerHTML.
    </p>`,
  cart: () => `
    <div class="detail">
      <h2>Your cart</h2>
      <div class="cart-item"><span>Chicken biryani × 1</span><span>₹350</span></div>
      <div class="cart-item"><span>Mirchi salan × 1</span><span>₹80</span></div>
      <div class="cart-item cart-total"><span>Total</span><span>₹430</span></div>
    </div>`,
};

function currentView() {
  const params = new URLSearchParams(window.location.search);
  const v = params.get("view") || "home";
  return v in VIEWS ? v : "home";
}

function render() {
  const view = currentView();
  document.getElementById("app").innerHTML = VIEWS[view]();
  document.getElementById("url-pill").textContent =
    window.location.search || "?view=home";
}

// Intercept clicks on any <a data-link>. Let the browser handle modified clicks
// (cmd/ctrl/shift/middle/right), external links, downloads, etc. — standard
// pattern, worth a sentence on the demo page.
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-link]");
  if (!a) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (e.button !== 0) return;
  e.preventDefault();
  const href = a.getAttribute("href");
  if (href === window.location.search) return; // already there
  window.history.pushState({}, "", href);
  render();
});

// Back/forward.
window.addEventListener("popstate", render);

// First paint.
render();
