"""Day 3, Demo 1 — the request lifecycle.

A deliberately tiny page (one Swiggy restaurant card) whose every resource is a
separate file, so the browser's Network tab shows the real request waterfall.

This server's only job is to hand back static files — and to log every request
to the terminal, so the terminal shows the same requests you see in DevTools.
"The server answered each one."
"""

import asyncio
import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

HERE = Path(__file__).parent

app = FastAPI()

request_count = 0

# Artificial delay (seconds) before serving app.js. This is a *teaching device*,
# not real behaviour: it holds back only the JavaScript, so during the demo the
# card looks finished but the Like button does nothing for a beat — click it and
# nothing happens — then it "comes alive" the moment the script finally lands.
# On a fast localhost connection there'd otherwise be no window to show this.
# Set APP_JS_DELAY_SECONDS=0 to disable (the tests do this so they stay fast).
APP_JS_DELAY_SECONDS = float(os.environ.get("APP_JS_DELAY_SECONDS", "3"))

# Suffixes we tell the browser it may reuse without re-asking. This is what makes
# the "(disk cache) — 0ms" beat work on the second (normal) reload: the browser
# already has these and skips the network entirely.
_CACHEABLE_SUFFIXES = (".css", ".js", ".jpg", ".jpeg", ".png", ".ico", ".woff2")


@app.middleware("http")
async def log_and_cache(request: Request, call_next):
    global request_count
    request_count += 1
    print(f"[{request_count}] -> {request.method} {request.url.path}", flush=True)
    response = await call_next(request)
    # Add caching headers so the second load shows the disk-cache contrast.
    if response.status_code == 200:
        if request.url.path.endswith(_CACHEABLE_SUFFIXES):
            # "Reuse this for the next hour" — the assets vanish from the waterfall.
            response.headers["Cache-Control"] = "max-age=3600"
        else:
            # The HTML document stays fresh, so only *half* the waterfall caches.
            response.headers["Cache-Control"] = "no-cache"
    return response


@app.get("/app.js")
async def slow_app_js():
    # Deliberately stall the behaviour layer (see APP_JS_DELAY_SECONDS above).
    if APP_JS_DELAY_SECONDS > 0:
        await asyncio.sleep(APP_JS_DELAY_SECONDS)
    return FileResponse(HERE / "app.js", media_type="text/javascript")


# Serve every other file in this directory. `html=True` makes "/" return
# index.html; style.css and the image are served at their own paths — each a
# distinct request in the waterfall. The explicit /app.js route above is
# registered first, so it takes precedence over this catch-all mount.
app.mount("/", StaticFiles(directory=HERE, html=True), name="site")
