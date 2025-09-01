"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Calendar } from "./ui/calendar"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { CalendarDays, Package, Heart, CreditCard, ShoppingCart } from "lucide-react"
import { format } from "date-fns"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/data/product"
import type { Extra } from "@/data/extras"
import { extras, extraCategories } from "@/data/extras"

interface AddToCartModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function AddToCartModal({ product, isOpen, onClose }: AddToCartModalProps) {
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([])
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    if (isOpen) {
      setSelectedExtras([])
      setDeliveryDate(null)
      setShowCalendar(false)
    }
  }, [isOpen])

  if (!product) return null

  const handleExtraToggle = (extra: Extra) => {
    setSelectedExtras(prev => {
      const isSelected = prev.find(e => e.id === extra.id)
      if (isSelected) {
        return prev.filter(e => e.id !== extra.id)
      } else {
        return [...prev, extra]
      }
    })
  }

  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0)
  const totalPrice = product.price + extrasTotal

  const handleAddToCart = () => {
    addItem(product, selectedExtras, deliveryDate)
    onClose()
  }

  const isValidDeliveryDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return date >= tomorrow
  }

  const disabledDays = {
    before: new Date(new Date().setDate(new Date().getDate() + 1))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Customize Your Order
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Summary */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <Badge variant="secondary">
                      Rp {product.price.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Date Selection */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Select Delivery Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                {deliveryDate ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        Delivery scheduled for:
                      </p>
                      <p className="text-green-700">
                        {format(deliveryDate, "EEEE, MMMM do, yyyy")}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowCalendar(true)}
                    >
                      Change Date
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      Choose your preferred delivery date (minimum 1 day ahead)
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCalendar(true)}
                      className="w-full"
                    >
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Select Date
                    </Button>
                  </div>
                )}

                {showCalendar && (
                  <div className="mt-4 p-3 border rounded-lg">
                    <Calendar
                      mode="single"
                      selected={deliveryDate || undefined}
                      onSelect={(date) => {
                        if (date && isValidDeliveryDate(date)) {
                          setDeliveryDate(date)
                          setShowCalendar(false)
                        }
                      }}
                      disabled={disabledDays}
                      className="rounded-md border-0"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowCalendar(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Extras Selection */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Extra Items</CardTitle>
                <p className="text-sm text-gray-600">
                  Make your gift even more special with these optional extras
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {extraCategories.map((category) => {
                  const categoryExtras = extras.filter(extra => extra.category === category.key)
                  
                  return (
                    <div key={category.key}>
                      <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                        {category.key === "packaging" && <Package className="h-4 w-4" />}
                        {category.key === "accessories" && <Heart className="h-4 w-4" />}
                        {category.key === "cards" && <CreditCard className="h-4 w-4" />}
                        {category.label}
                      </h4>
                      
                      <div className="space-y-2">
                        {categoryExtras.map((extra) => {
                          const isSelected = selectedExtras.some(e => e.id === extra.id)
                          
                          return (
                            <div 
                              key={extra.id}
                              className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => handleExtraToggle(extra)}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleExtraToggle(extra)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-medium text-sm">{extra.name}</h5>
                                  <Badge variant="outline" className="text-xs">
                                    +Rp {extra.price.toLocaleString()}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {extra.description}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      
                      {category.key !== "cards" && <Separator className="my-4" />}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Summary & Actions */}
        <div className="border-t pt-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold">Order Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>{product.name}</span>
                  <span>Rp {product.price.toLocaleString()}</span>
                </div>
                {selectedExtras.length > 0 && (
                  <div className="flex justify-between">
                    <span>Extras ({selectedExtras.length} items)</span>
                    <span>Rp {extrasTotal.toLocaleString()}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rp {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleAddToCart}
              className="flex-1"
              disabled={!deliveryDate}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
          
          {!deliveryDate && (
            <p className="text-xs text-red-600 mt-2 text-center">
              Please select a delivery date to continue
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}