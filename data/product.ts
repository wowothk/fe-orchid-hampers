export type Product = {
  id: number
  name: string
  description: string
  price: number
  image: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "Rose Bouquet",
    description: "Classic red roses arranged elegantly — perfect for romantic occasions.",
    price: 500000,
    image: "/images/rose.png",
  },
  {
    id: 2,
    name: "Tulip Arrangement",
    description: "Bright tulips in assorted colors, symbolizing happiness and cheer.",
    price: 650000,
    image: "/images/tullip.png",
  },
  {
    id: 3,
    name: "Orchid Basket",
    description: "A refined orchid arrangement that brings a touch of luxury to any room.",
    price: 800000,
    image: "/images/orchid.png",
  },
]
