"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { AddToCartModal } from "./AddToCartModal"
import type { Product } from "@/data/product"

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
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
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary">
              Rp {product.price.toLocaleString()}
            </Badge>
            {product.stock <= product.lowStockThreshold && product.stock > 0 && (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                Low Stock
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                Out of Stock
              </Badge>
            )}
          </div>
          <Button 
            className="w-full" 
            onClick={() => setShowModal(true)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardContent>
      </Card>

      <AddToCartModal
        product={product}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
