"use client"

import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/data/product"

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart()

  return (
    <Card className="w-full max-w-sm shadow-sm hover:shadow-md transition">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-full mb-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <Badge variant="secondary" className="mb-3">
          Rp {product.price.toLocaleString()}
        </Badge>
        <Button className="w-full" onClick={() => addItem(product)}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
