// Menu data for the Day-3 rendering-strategies demo.
//
// This file backs two routes:
//   /menu   (SSG)    — a restaurant's full menu, frozen at build time
//   /detail (Hybrid) — same menu, plus client islands for search + add-to-cart
//
// In a real Swiggy backend this would be a DB query; here it's typed
// in-memory data so the only variable is the rendering strategy.

export type MenuSection =
  | "Starters"
  | "Biryanis"
  | "Mains"
  | "Breads"
  | "Desserts";

export type MenuItem = {
  id: string;
  section: MenuSection;
  name: string;
  description: string;
  price: number; // rupees
  emoji: string;
  isBestseller?: boolean;
  isSpicy?: boolean;
};

export const meghanaMenu: MenuItem[] = [
  // Starters
  { id: "m-s1", section: "Starters", name: "Chicken 65", description: "Crispy fried chicken, curry leaves, green chillies.", price: 285, emoji: "🍗", isBestseller: true, isSpicy: true },
  { id: "m-s2", section: "Starters", name: "Apollo Fish", description: "Boneless basa marinated in Andhra spices, deep-fried.", price: 310, emoji: "🐟", isSpicy: true },
  { id: "m-s3", section: "Starters", name: "Paneer 65", description: "Vegetarian take on the 65 — paneer cubes, batter-fried.", price: 245, emoji: "🧀" },

  // Biryanis
  { id: "m-b1", section: "Biryanis", name: "Special Chicken Biryani", description: "Long-grain rice, slow-cooked with bone-in chicken, served with raita and salan.", price: 325, emoji: "🍛", isBestseller: true, isSpicy: true },
  { id: "m-b2", section: "Biryanis", name: "Donne Chicken Biryani", description: "Bangalore-style biryani in a leaf bowl. Bold flavours.", price: 295, emoji: "🍛", isBestseller: true },
  { id: "m-b3", section: "Biryanis", name: "Mutton Biryani", description: "Slow-cooked mutton over fragrant basmati. Heavy lift.", price: 395, emoji: "🍛", isSpicy: true },
  { id: "m-b4", section: "Biryanis", name: "Veg Biryani", description: "Mixed vegetables, mint, dum-cooked.", price: 245, emoji: "🥘" },

  // Mains
  { id: "m-m1", section: "Mains", name: "Andhra Chicken Curry", description: "Coconut, ginger, tamarind. Spicy. Best with rice.", price: 295, emoji: "🍲", isSpicy: true },
  { id: "m-m2", section: "Mains", name: "Butter Chicken", description: "Tomato cream, mild, the crowd-pleaser.", price: 305, emoji: "🍲" },
  { id: "m-m3", section: "Mains", name: "Paneer Butter Masala", description: "Vegetarian version of the above. Same gravy.", price: 265, emoji: "🍛" },

  // Breads
  { id: "m-br1", section: "Breads", name: "Butter Naan", description: "Tandoor-baked, brushed with butter.", price: 65, emoji: "🫓" },
  { id: "m-br2", section: "Breads", name: "Garlic Naan", description: "Garlic and coriander on tandoor-baked naan.", price: 85, emoji: "🫓" },
  { id: "m-br3", section: "Breads", name: "Tandoori Roti", description: "Whole-wheat, leaner than naan.", price: 45, emoji: "🫓" },

  // Desserts
  { id: "m-d1", section: "Desserts", name: "Double Ka Meetha", description: "Bread pudding, saffron, cardamom.", price: 145, emoji: "🍮" },
  { id: "m-d2", section: "Desserts", name: "Qubani Ka Meetha", description: "Stewed apricots with cream. Hyderabadi classic.", price: 165, emoji: "🍑" },
];

export const MENU_SECTIONS: MenuSection[] = [
  "Starters",
  "Biryanis",
  "Mains",
  "Breads",
  "Desserts",
];

// Group a flat item list into its sections, in the canonical order above.
export function groupBySection(items: MenuItem[]): { section: MenuSection; items: MenuItem[] }[] {
  return MENU_SECTIONS.map((section) => ({
    section,
    items: items.filter((it) => it.section === section),
  })).filter((g) => g.items.length > 0);
}
