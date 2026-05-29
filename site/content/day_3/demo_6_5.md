# "The page that never reloads"

You can build something that looks and feels like a multi-page app without ever leaving the page. The browser's History API plus a `<main>` swap is all you need. That's an SPA — and once you've seen one, every "rendering strategy" we look at next is an answer to a problem the SPA created.

## Setup

Use the tab picker above the iframe to switch between **MPA (full reload)** and **SPA (no reload)**.

1. Open DevTools → **Network** tab.
2. Start on **MPA**. Click a restaurant card, then Home, then Cart. Every click adds a new HTML request to the waterfall. Watch the page flash white between navs.
3. Switch to **SPA**. Click around. After the first load, the Network tab is silent — every "page" is the same `index-spa.html` with new content swapped in.
4. View Source on the SPA tab. Almost empty. The content lives only in the live DOM.

## What an SPA actually is

<p class="beat__lede">A single HTML document, plus JavaScript that swaps the page's contents when you "navigate."</p>

- The server only ships **one** HTML file. No matter what URL you visit, you get the same shell.
- JavaScript reads the URL, decides what to show, and writes it into the DOM.
- When you click a link, the script intercepts the click, updates the URL with `history.pushState` (no reload), and writes new content.
- Back / forward work because the browser fires `popstate` events that the script listens for.
- Refresh works because the script reads the URL on first paint, every time.

That's the entire mechanism. Three browser APIs — `addEventListener('click')`, `history.pushState`, `window.addEventListener('popstate')` — and a function that maps a URL to a chunk of HTML.

## Compare and contrast

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

## The dead end — and why we're about to revisit it

<p class="beat__lede">An SPA's "first load is empty" problem is real. Google sees nothing. Slow phones see a blank screen while JS boots. Share a link, the preview is empty.</p>

- The fix isn't "stop using SPAs." The fix is **give the server some work back** — render the first paint as real HTML, then let the SPA take over after the page is interactive.
- That's the whole next section: SSG (build the HTML once), SSR (build it per request), CSR (the pure SPA we just saw). Same destination, three different starting points.
- Next.js's `<Link>` (Demo 8.5) gives you SPA-style navigation **after** the first paint, with prerendered pages for the first paint. Best of both worlds.

So Demo 6.5 is the thing the next four demos are answers to.

## Going deeper — why click interception is tricky

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
