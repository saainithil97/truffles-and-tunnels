// The canonical Swiggy restaurant dataset, shared by every demo.
// In a real app this would come from a database or API; here it is a typed
// in-memory list so the rendering strategy is the only thing that varies.

export type Restaurant = {
  id: number;
  name: string;
  cuisines: string;
  rating: number;
  deliveryTime: number; // minutes
  costForTwo: number; // rupees
  emoji: string;
};

export const restaurants: Restaurant[] = [
  { id: 1, name: "Meghana Foods", cuisines: "Biryani, Andhra", rating: 4.3, deliveryTime: 40, costForTwo: 500, emoji: "🍛" },
  { id: 2, name: "Truffles", cuisines: "American, Burgers", rating: 4.5, deliveryTime: 35, costForTwo: 600, emoji: "🍔" },
  { id: 3, name: "Empire Restaurant", cuisines: "North Indian, Kebabs", rating: 4.1, deliveryTime: 30, costForTwo: 450, emoji: "🍢" },
  { id: 4, name: "Pizza Hut", cuisines: "Pizza, Italian", rating: 3.9, deliveryTime: 45, costForTwo: 700, emoji: "🍕" },
  { id: 5, name: "Corner House", cuisines: "Desserts, Ice Cream", rating: 4.6, deliveryTime: 25, costForTwo: 350, emoji: "🍨" },
  { id: 6, name: "A2B", cuisines: "South Indian, Sweets", rating: 4.2, deliveryTime: 30, costForTwo: 300, emoji: "🍲" },
  { id: 7, name: "Leon Grill", cuisines: "Shawarma, Rolls", rating: 4.0, deliveryTime: 35, costForTwo: 400, emoji: "🌯" },
  { id: 8, name: "Burger King", cuisines: "Burgers, Fast Food", rating: 4.1, deliveryTime: 30, costForTwo: 400, emoji: "🍔" },
  { id: 9, name: "Mainland China", cuisines: "Chinese, Asian", rating: 4.4, deliveryTime: 50, costForTwo: 900, emoji: "🥡" },
  { id: 10, name: "Keventers", cuisines: "Beverages, Milkshakes", rating: 4.3, deliveryTime: 20, costForTwo: 250, emoji: "🥤" },
  { id: 11, name: "Sip & Bite", cuisines: "Cafe, Snacks", rating: 3.8, deliveryTime: 40, costForTwo: 350, emoji: "☕" },
  { id: 12, name: "Nandhana Palace", cuisines: "Andhra, Biryani", rating: 4.2, deliveryTime: 45, costForTwo: 550, emoji: "🍛" },
  { id: 13, name: "Faasos", cuisines: "Wraps, Rolls", rating: 4.0, deliveryTime: 30, costForTwo: 300, emoji: "🌯" },
  { id: 14, name: "Domino's Pizza", cuisines: "Pizza, Italian", rating: 4.0, deliveryTime: 30, costForTwo: 500, emoji: "🍕" },
  { id: 15, name: "Ovenstory Pizza", cuisines: "Pizza, Gourmet", rating: 4.1, deliveryTime: 40, costForTwo: 600, emoji: "🍕" },
];

export function getRestaurant(id: number): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}
