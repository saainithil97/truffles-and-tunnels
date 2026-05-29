"""Day 3, Demo 4 — the expensive DOM (layout, reflow, paint).

A page of 500 restaurant tiles with two resize buttons: one that mutates each
tile individually in a loop (forcing synchronous layout thrash) and one that
does the same visual change in a single layout/paint. This server just hands
back the static files and logs every request, mirroring the Demo 3 pattern.
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


# Serve every file in this directory. `html=True` makes "/" return index.html.
app.mount("/", StaticFiles(directory=HERE, html=True), name="site")
