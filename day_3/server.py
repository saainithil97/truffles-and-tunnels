"""Day 3, Demo 1 — the request lifecycle.

A deliberately tiny page (one Swiggy restaurant card) whose every resource is a
separate file, so the browser's Network tab shows the real request waterfall.

This server's only job is to hand back static files — and to log every request
to the terminal, so the terminal shows the same requests you see in DevTools.
"The server answered each one."
"""

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles

HERE = Path(__file__).parent

app = FastAPI()

request_count = 0


@app.middleware("http")
async def log_requests(request: Request, call_next):
    global request_count
    request_count += 1
    print(f"[{request_count}] -> {request.method} {request.url.path}", flush=True)
    return await call_next(request)


# Serve every file in this directory. `html=True` makes "/" return index.html;
# style.css, app.js and the image are then served at their own paths — each a
# distinct request in the waterfall.
app.mount("/", StaticFiles(directory=HERE, html=True), name="site")
