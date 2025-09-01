import { products } from "@/data/product"
import { ProductCard } from "@/components/ProductCard"

export default function CatalogPage() {
  // const handleAddToCart = (product: any) => {
  //   console.log("Add to cart:", product)
  // }

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
  )
}
