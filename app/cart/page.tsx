"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, CalendarDays, Package } from "lucide-react"
import { format } from "date-fns"

export default function CartPage() {
  const { state, updateQuantity, removeItem } = useCart()

  if (state.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add some beautiful flowers to get started!</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item, index) => (
            <Card key={`${item.product.id}-${index}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row sm:flex-row gap-4">
                  
                  {/* Product Image */}
                  <div className="relative h-32 w-32 md:h-24 md:w-24 flex-shrink-0 mx-auto md:mx-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  {/* Main Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm">{item.product.description}</p>
                    </div>

                    {/* Product Price */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        Base: Rp {item.product.price.toLocaleString()}
                      </Badge>
                      <Badge variant="outline">
                        Total: Rp {(item.totalPrice || item.product.price).toLocaleString()}
                      </Badge>
                    </div>

                    {/* Extras Display */}
                    {item.selectedExtras?.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Selected Extras:</span>
                        </div>
                        <div className="space-y-1">
                          {item.selectedExtras.map((extra) => (
                            <div key={extra.id} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">{extra.name}</span>
                              <span className="text-gray-700">+Rp {extra.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Delivery Date */}
                    {item.deliveryDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 font-medium">
                          Delivery: {format(new Date(item.deliveryDate), "EEEE, MMMM do, yyyy")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions & Quantity Control */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 md:gap-3 w-full md:w-auto mt-4 md:mt-0">
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">
                        Rp {((item.totalPrice || item.product.price) * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × Rp {(item.totalPrice || item.product.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          ))}
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({state.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span>Rp {state.total.toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>Rp {state.total.toLocaleString()}</span>
                </div>
              </div>
              
              <Link href="/checkout" className="w-full">
                <Button className="w-full mb-2" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}