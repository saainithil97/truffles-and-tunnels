from fastapi import FastAPI

app = FastAPI()

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


@app.get("/restaurants")
async def get_restaurants():
    return {"restaurants": RESTAURANTS}
