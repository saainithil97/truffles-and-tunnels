# "The page that never reloads"

You can build something that looks and feels like a multi-page app without ever leaving the page. The browser's History API plus a `<main>` swap is all you need. That's an SPA — and once you've seen one, every "rendering strategy" we look at next is an answer to a problem the SPA created.

## Setup

Use the tab picker above the iframe to switch between **MPA (full reload)** and **SPA (no reload)**.

1. Open DevTools → **Network** tab.
2. Start on **MPA**. Click a restaurant card, then Home, then Cart. Every click adds a new HTML request to the waterfall. Watch the page flash white between navs.
3. Switch to **SPA**. Click around. After the first load, the Network tab is silent — every "page" is the same `index-spa.html` with new content swapped in.
4. View Source on the SPA tab. Almost empty. The content lives only in the live DOM.

## Content

### What an SPA actually is

<p class="beat__lede">A single HTML document, plus JavaScript that swaps the page's contents when you "navigate."</p>

- The server only ships **one** HTML file. No matter what URL you visit, you get the same shell.
- JavaScript reads the URL, decides what to show, and writes it into the DOM.
- When you click a link, the script intercepts the click, updates the URL with `history.pushState` (no reload), and writes new content.
- Back / forward work because the browser fires `popstate` events that the script listens for.
- Refresh works because the script reads the URL on first paint, every time.

That's the entire mechanism. Three browser APIs — `addEventListener('click')`, `history.pushState`, `window.addEventListener('popstate')` — and a function that maps a URL to a chunk of HTML.

### Compare and contrast

<p class="beat__lede">Same app, two patterns. Watch DevTools while you click — the differences are not subtle.</p>

| | MPA (full reload) | SPA (no reload) |
|---|---|---|
| **View Source on any page** | Full HTML for that page | Empty shell, same on every URL |
| **Network tab after first load** | New HTML request per click | Silent — no requests |
| **Page flash between navs** | Yes | No |
| **Scroll position** | Resets to top | Preserved |
| **What if JavaScript fails?** | Still works | Empty page |
| **What can crawlers see?** | Everything | Nothing |
| **Feels fast?** | Slow on bad networks (full re-download) | Instant after first load |
| **Cost of the first load** | Cheap (one small page) | Bigger (ship the whole app) |

### Would a library make this easier?

<p class="beat__lede">Most production SPAs aren't written this way — they reach for a UI library (React, Vue, Svelte, Solid…) and usually a router library on top. Here's the part of <code>app.js</code> that those libraries take off your plate.</p>

- **The render() loop.** `app.js` rebuilds `<main>`'s `innerHTML` every time the route changes. A UI library lets you describe the UI as a function of state — `<View route={currentRoute} />` — and figures out what to actually change in the DOM. You stop writing DOM-update code.
- **Re-attaching event handlers.** Every `innerHTML` swap blows away listeners; `app.js` would need event delegation to survive that. In a UI library, handlers (`onClick={...}`) are part of the component; the library re-attaches them after every update.
- **Templating.** Each view in `app.js` is a function returning an HTML string. With a UI library, each view is a component you can reuse, compose, and pass props to. Boilerplate goes down; reuse goes up.
- **Routing plumbing.** `pushState`, `popstate`, click interception — what you wrote here by hand. A router library (React Router, TanStack Router, vue-router, SvelteKit's router) wraps all of it in a component API: `<Link>`, `<Route>`, `<Outlet>`. Same browser APIs underneath.

Concretely, the same three routes — home, restaurant, cart — in React:

```jsx
const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

const getView = () =>
  new URLSearchParams(location.search).get("view") || "home";

const VIEWS = {
  home: () => (
    <ul className="restaurants">
      <li><a href="?view=restaurant" data-link>Meghana Foods</a></li>
      <li><a href="?view=restaurant" data-link>Truffles</a></li>
      <li><a href="?view=restaurant" data-link>Burma Burma</a></li>
    </ul>
  ),
  restaurant: () => <div className="detail"><h2>Meghana Foods</h2></div>,
  cart: () => <div className="detail"><h2>Your cart</h2></div>,
};

function App() {
  const [view, setView] = useState(getView);

  useEffect(() => {
    const onPop = () => setView(getView());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (e) => {
    const a = e.target.closest("a[data-link]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    history.pushState({}, "", a.getAttribute("href"));
    setView(getView());
  };

  return <main onClick={navigate}>{VIEWS[view]()}</main>;
}

createRoot(document.getElementById("app")).render(<App />);
```

What disappeared from `app.js`: the `render()` function (the library's diff replaces it) and the manual `popstate` listener (replaced by `useEffect`). What's still there: the click interceptor — until you add a router library, which would replace it with `<Link to="?view=cart">Cart</Link>`.

So the answer to "do I need a library for this?" is no — you can build an SPA in vanilla, and Demo 6.5 just did. But each piece of `app.js` you'd rather not write or maintain has a library that handles it. And once you reach for a UI library + a router, the next obvious move is reaching for *one framework* that ships them together. That's Next.js (Demo 6.6).

### The dead end — and why we're about to revisit it

<p class="beat__lede">An SPA's "first load is empty" problem is real. Google sees nothing. Slow phones see a blank screen while JS boots. Share a link, the preview is empty.</p>

- The fix isn't "stop using SPAs." The fix is **give the server some work back** — render the first paint as real HTML, then let the SPA take over after the page is interactive.
- That's the whole next section: SSG (build the HTML once), SSR (build it per request), CSR (the pure SPA we just saw). Same destination, three different starting points.
- Next.js's `<Link>` (Demo 6.6) gives you SPA-style navigation **after** the first paint, with prerendered pages for the first paint. Best of both worlds.

So Demo 6.5 is the thing the next four demos are answers to.

### Going deeper — why click interception is tricky

<p class="beat__lede">The SPA's click handler can't just call <code>preventDefault</code> on every link. Real users do things you have to let the browser handle.</p>

- **Cmd-click / ctrl-click / middle-click** — opens in a new tab. The script should not call `preventDefault`.
- **Shift-click** — opens in a new window. Same.
- **Right-click → Copy link** — the user expects the real URL.
- **External links** (`<a href="https://...">`) — the script only intercepts same-origin links.
- **Downloads** (`<a download>`) — let the browser handle it.

The standard pattern: only intercept plain left-clicks on links marked `data-link` (or whatever convention you adopt). Everything else falls through. That's what this demo's `app.js` does — see the source.

## Takeaways

- **An SPA is a single HTML shell + JS that swaps content on URL changes.** That's it. No framework required.
- **The mechanism is three browser APIs:** click interception, `history.pushState`, `popstate`.
- **SPAs break SEO and first paint.** Crawlers and slow phones see an empty shell.
- **SPAs feel instant *after* the first load.** That's the whole appeal — and the reason the rendering-strategies demos exist.
- **`pushState` doesn't talk to the server.** You can put any string in the URL. The server has to serve the shell for every route, or refresh will 404.
- **Click interception has to respect modifier keys.** Cmd-click, middle-click, etc. fall through to the browser.
