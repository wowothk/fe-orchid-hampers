export type Product = {
  id: number
  name: string
  description: string
  price: number
  image: string
  stock: number
  lowStockThreshold: number
}

export const products: Product[] = [
  {
    id: 1,
    name: "Orchid Bouquet",
    description: "Classic purple orchid arranged elegantly — perfect for romantic occasions.",
    price: 500000,
    image: "/images/ungu.jpg",
    stock: 25,
    lowStockThreshold: 5,
  },
  {
    id: 2,
    name: "White Arrangement",
    description: "Bright orchid in assorted colors, symbolizing happiness and cheer.",
    price: 650000,
    image: "/images/white.webp",
    stock: 15,
    lowStockThreshold: 3,
  },
  {
    id: 3,
    name: "Orchid Basket",
    description: "A refined orchid arrangement that brings a touch of luxury to any room.",
    price: 800000,
    image: "/images/kuning.jpeg",
    stock: 8,
    lowStockThreshold: 2,
  },
]
