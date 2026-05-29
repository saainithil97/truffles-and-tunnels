"""Day 3, Demo 3 — render blocking.

The same Swiggy page served three ways (version-a/b/c.html), differing only in
where the <script> tag sits. This server just hands back the static files and
logs every request, so you can watch when slow.js is fetched relative to the
page — in the terminal and in the Network tab.
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
