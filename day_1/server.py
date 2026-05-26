from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse

app = FastAPI()

hit_count = 0

RESTAURANTS = [
    {
        "name": "Truffles",
        "cuisines": ["American", "Burgers"],
        "rating": 4.5,
        "delivery_time_mins": 30,
        "cost_for_two": 300,
    },
    {
        "name": "Meghana Foods",
        "cuisines": ["Biryani", "Andhra"],
        "rating": 4.3,
        "delivery_time_mins": 40,
        "cost_for_two": 500,
    },
    {
        "name": "Empire Restaurant",
        "cuisines": ["North Indian", "Kebabs"],
        "rating": 4.2,
        "delivery_time_mins": 35,
        "cost_for_two": 400,
    },
    {
        "name": "A2B - Adyar Ananda Bhavan",
        "cuisines": ["South Indian", "Sweets"],
        "rating": 4.4,
        "delivery_time_mins": 25,
        "cost_for_two": 250,
    },
    {
        "name": "Burger King",
        "cuisines": ["Burgers", "American"],
        "rating": 4.1,
        "delivery_time_mins": 30,
        "cost_for_two": 350,
    },
    {
        "name": "Chai Point",
        "cuisines": ["Beverages", "Snacks"],
        "rating": 4.3,
        "delivery_time_mins": 20,
        "cost_for_two": 200,
    },
]

HTML_PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Restaurants near you</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; color: #222; }
  h1 { margin-bottom: 0.25rem; }
  .visitor { color: #888; font-size: 0.9rem; margin-bottom: 2rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
  .card { border: 1px solid #e3e3e3; border-radius: 8px; padding: 1rem; background: #fff; }
  .card h2 { margin: 0 0 0.5rem; font-size: 1.1rem; }
  .meta { color: #555; font-size: 0.9rem; line-height: 1.5; }
  .rating { color: #1a8b3a; font-weight: 600; }
</style>
</head>
<body>
<h1>Restaurants near you</h1>
<div class="visitor">You are visitor #__COUNT__</div>
<div id="grid" class="grid"></div>
<script>
  fetch('/restaurants')
    .then(r => r.json())
    .then(data => {
      const grid = document.getElementById('grid');
      for (const r of data.restaurants) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h2>${r.name}</h2>
          <div class="meta">
            <div>${r.cuisines.join(', ')}</div>
            <div><span class="rating">★ ${r.rating}</span> &middot; ${r.delivery_time_mins} mins &middot; ₹${r.cost_for_two} for two</div>
          </div>
        `;
        grid.appendChild(card);
      }
    });
</script>
</body>
</html>
"""


@app.get("/restaurants")
async def get_restaurants(request: Request):
    global hit_count
    client_ip = request.client.host if request.client else "unknown"
    print(f"[{hit_count}] {client_ip} -> /restaurants", flush=True)
    return {"restaurants": RESTAURANTS}


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    global hit_count
    hit_count += 1
    client_ip = request.client.host if request.client else "unknown"
    print(f"[{hit_count}] {client_ip} -> /", flush=True)
    return HTMLResponse(HTML_PAGE.replace("__COUNT__", str(hit_count)))
