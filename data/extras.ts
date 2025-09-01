export type Extra = {
  id: string
  name: string
  description: string
  price: number
  category: "packaging" | "accessories" | "cards"
}

export const extras: Extra[] = [
  // Packaging
  {
    id: "premium-wrap",
    name: "Premium Gift Wrapping",
    description: "Elegant gift wrapping with ribbon and bow",
    price: 25000,
    category: "packaging"
  },
  {
    id: "deluxe-box",
    name: "Deluxe Gift Box",
    description: "Premium wooden gift box presentation",
    price: 50000,
    category: "packaging"
  },
  {
    id: "waterproof-wrap",
    name: "Waterproof Wrapping",
    description: "Weather-resistant packaging for outdoor delivery",
    price: 15000,
    category: "packaging"
  },
  
  // Accessories
  {
    id: "greeting-card",
    name: "Personalized Greeting Card",
    description: "Custom message card with your personal note",
    price: 10000,
    category: "cards"
  },
  {
    id: "chocolate-box",
    name: "Premium Chocolate Box",
    description: "Assorted premium chocolates (12 pieces)",
    price: 75000,
    category: "accessories"
  },
  {
    id: "teddy-bear",
    name: "Small Teddy Bear",
    description: "Cute plush teddy bear companion",
    price: 45000,
    category: "accessories"
  },
  {
    id: "balloon-set",
    name: "Balloon Bouquet",
    description: "Set of 5 colorful helium balloons",
    price: 30000,
    category: "accessories"
  },
  
  // Cards
  {
    id: "birthday-card",
    name: "Birthday Card",
    description: "Special birthday wishes card",
    price: 8000,
    category: "cards"
  },
  {
    id: "love-card",
    name: "Love & Romance Card",
    description: "Romantic message card for special occasions",
    price: 8000,
    category: "cards"
  },
  {
    id: "congratulations-card",
    name: "Congratulations Card",
    description: "Celebration and achievement card",
    price: 8000,
    category: "cards"
  }
]

export const extraCategories = [
  { key: "packaging", label: "Gift Wrapping & Packaging" },
  { key: "accessories", label: "Add-on Gifts" },
  { key: "cards", label: "Greeting Cards" }
] as const