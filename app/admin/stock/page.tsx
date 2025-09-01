"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, Plus, Minus, Edit2 } from "lucide-react"
import { products as initialProducts, Product } from "@/data/product"

function StockManagementContent() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [tempStock, setTempStock] = useState<number>(0)

  const handleStockUpdate = (productId: number, newStock: number) => {
    if (newStock < 0) return
    
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock }
          : product
      )
    )
  }

  const startEditing = (product: Product) => {
    setEditingId(product.id)
    setTempStock(product.stock)
  }

  const saveEdit = (productId: number) => {
    handleStockUpdate(productId, tempStock)
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTempStock(0)
  }

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { status: "out", color: "bg-red-100 text-red-800", label: "Out of Stock" }
    if (product.stock <= product.lowStockThreshold) return { status: "low", color: "bg-yellow-100 text-yellow-800", label: "Low Stock" }
    return { status: "good", color: "bg-green-100 text-green-800", label: "In Stock" }
  }

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold)
  const outOfStockProducts = products.filter(p => p.stock === 0)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Package className="h-8 w-8 text-blue-500" />
          Stock Management
        </h1>
        <p className="text-gray-600">Manage product inventory and stock levels</p>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold">{lowStockProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Package className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold">{outOfStockProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outOfStockProducts.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-red-700 mb-2">Out of Stock:</p>
                <div className="flex flex-wrap gap-2">
                  {outOfStockProducts.map(product => (
                    <Badge key={product.id} className="bg-red-100 text-red-800">
                      {product.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {lowStockProducts.length > 0 && (
              <div>
                <p className="font-semibold text-yellow-700 mb-2">Low Stock:</p>
                <div className="flex flex-wrap gap-2">
                  {lowStockProducts.filter(p => p.stock > 0).map(product => (
                    <Badge key={product.id} className="bg-yellow-100 text-yellow-800">
                      {product.name} ({product.stock} left)
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => {
              const stockStatus = getStockStatus(product)
              const isEditing = editingId === product.id

              return (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-lg">{product.name}</h4>
                      <p className="text-sm text-gray-600">Rp {product.price.toLocaleString()}</p>
                      <Badge className={stockStatus.color}>
                        {stockStatus.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={tempStock}
                          onChange={(e) => setTempStock(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-20"
                          min="0"
                        />
                        <Button size="sm" onClick={() => saveEdit(product.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStockUpdate(product.id, product.stock - 1)}
                            disabled={product.stock === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold text-lg w-12 text-center">
                            {product.stock}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStockUpdate(product.id, product.stock + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(product)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function StockManagement() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <StockManagementContent />
    </ProtectedRoute>
  )
}