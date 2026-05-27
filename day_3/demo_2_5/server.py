"""Day 3, Demo 2.5 — browser storage.

A small Swiggy preferences/checkout page (index.html + app.js + style.css) that
makes localStorage and sessionStorage concrete. This server just hands back the
static files and logs every request, so the terminal mirrors what the browser
fetches. No artificial delays — storage is the demo, not the network.
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
