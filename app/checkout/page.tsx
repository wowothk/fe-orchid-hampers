"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, User, Lock, Package, CalendarDays, Truck, MapPin } from "lucide-react"
import { format } from "date-fns"

type CustomerInfo = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

type DeliveryOption = {
  id: string
  name: string
  description: string
  price: number
  estimatedTime: string
  logo?: string
}

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [selectedDelivery, setSelectedDelivery] = useState("standard")
  const [orderId, setOrderId] = useState("")

  const deliveryOptions: DeliveryOption[] = [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "Our own delivery service with care and attention",
      price: 0,
      estimatedTime: "Same day delivery"
    },
    {
      id: "lalamove",
      name: "Lalamove",
      description: "Fast and reliable third-party delivery",
      price: 25000,
      estimatedTime: "2-4 hours delivery"
    },
    {
      id: "deliveree",
      name: "Deliveree",
      description: "Professional logistics delivery service",
      price: 30000,
      estimatedTime: "3-6 hours delivery"
    }
  ]

  const selectedDeliveryOption = deliveryOptions.find(option => option.id === selectedDelivery)
  const deliveryFee = selectedDeliveryOption?.price || 0
  const finalTotal = state.total + deliveryFee

  // Show login prompt for guests
  if (!user && !orderCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Login Required</h1>
              <p className="text-gray-600 mb-6">
                Please sign in to continue with your order and complete the checkout process.
              </p>
            </div>

            <div className="space-y-4">
              <Link href="/login?redirect=/checkout">
                <Button className="w-full" size="lg">
                  <User className="h-4 w-4 mr-2" />
                  Sign In to Continue
                </Button>
              </Link>
              
              <div className="text-sm text-gray-500">
                <p>Don&apos;t have an account? You can create one during the login process.</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="font-medium mb-4">Your Cart Summary</h3>
              <div className="space-y-2">
                {state.items.map((item, index) => (
                  <div key={`${item.product.id}-${index}`} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span>{item.quantity}× {item.product.name}</span>
                      <span>Rp {((item.totalPrice || item.product.price) * item.quantity).toLocaleString()}</span>
                    </div>
                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <div className="text-xs text-gray-500 ml-4">
                        + {item.selectedExtras.length} extra(s)
                      </div>
                    )}
                  </div>
                ))}
                <div className="border-t pt-2 font-semibold">
                  <div className="flex justify-between">
                    <span>Total: </span>
                    <span>Rp {state.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state.items.length === 0 && !orderCompleted) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">No Items to Checkout</h1>
        <p className="text-gray-600 mb-6">Your cart is empty. Add some flowers first!</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    return Object.values(customerInfo).every(value => value.trim() !== "")
  }

  const handleSubmitOrder = async () => {
    if (!isFormValid()) return
    
    setIsProcessing(true)
    
    // Generate order ID
    const newOrderId = "ORD-" + Date.now().toString().slice(-6)
    setOrderId(newOrderId)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Store order in localStorage for demo purposes
    const order = {
      id: newOrderId,
      customerInfo,
      items: state.items,
      total: state.total,
      deliveryFee,
      finalTotal,
      selectedDelivery: selectedDeliveryOption,
      paymentMethod,
      status: "paid",
      date: new Date().toISOString(),
    }
    
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    localStorage.setItem("orders", JSON.stringify([...existingOrders, order]))
    
    setOrderCompleted(true)
    clearCart()
    setIsProcessing(false)
  }

  if (orderCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">
            Order ID: <span className="font-mono font-semibold">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We&apos;ll send you a confirmation email shortly.
          </p>
        </div>
        
        <Card className="text-left mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {customerInfo.name}</p>
              <p><span className="font-medium">Email:</span> {customerInfo.email}</p>
              <p><span className="font-medium">Phone:</span> {customerInfo.phone}</p>
              <p><span className="font-medium">Address:</span> {customerInfo.address}, {customerInfo.city} {customerInfo.postalCode}</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Link href={`/orders/${orderId}`}>
            <Button className="w-full">View Order Details</Button>
          </Link>
          <Link href="/orders">
            <Button variant="outline" className="w-full">All My Orders</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/cart" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your address"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter your city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <Input
                    value={customerInfo.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Choose Delivery Service</label>
                <div className="space-y-3">
                  {deliveryOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDelivery === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDelivery(option.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id={option.id}
                          name="delivery"
                          value={option.id}
                          checked={selectedDelivery === option.id}
                          onChange={(e) => setSelectedDelivery(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-gray-600" />
                          <div>
                            <label htmlFor={option.id} className="font-medium text-sm cursor-pointer">
                              {option.name}
                            </label>
                            <p className="text-xs text-gray-600">{option.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="h-3 w-3 text-gray-500" />
                              <span className="text-xs text-gray-500">{option.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={option.price === 0 ? "secondary" : "outline"}>
                          {option.price === 0 ? "Free" : `Rp ${option.price.toLocaleString()}`}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="credit_card"
                      name="payment"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="credit_card" className="text-sm">Credit Card</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="bank_transfer"
                      name="payment"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="bank_transfer" className="text-sm">Bank Transfer</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="e_wallet"
                      name="payment"
                      value="e_wallet"
                      checked={paymentMethod === "e_wallet"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="e_wallet" className="text-sm">E-Wallet (GoPay/OVO/DANA)</label>
                  </div>
                </div>
              </div>
              
              {paymentMethod === "credit_card" && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium mb-1">Card Number</label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === "bank_transfer" && (
                <div className="pt-4 border-t bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Demo:</strong> Transfer to Bank ABC<br />
                    Account: 1234567890<br />
                    Amount: Rp {finalTotal.toLocaleString()}
                  </p>
                </div>
              )}
              
              {paymentMethod === "e_wallet" && (
                <div className="pt-4 border-t bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Demo:</strong> Scan QR code or open your e-wallet app<br />
                    Amount: Rp {finalTotal.toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {state.items.map((item, index) => (
                  <div key={`${item.product.id}-${index}`} className="space-y-2">
                    <div className="flex gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        
                        {/* Delivery Date */}
                        {item.deliveryDate && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CalendarDays className="h-3 w-3" />
                            <span>{format(new Date(item.deliveryDate), "MMM dd, yyyy")}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          Rp {((item.totalPrice || item.product.price) * item.quantity).toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Extras Display */}
                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <div className="ml-15 pl-3 border-l-2 border-gray-100">
                        <div className="flex items-center gap-1 mb-1">
                          <Package className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">Extras:</span>
                        </div>
                        <div className="space-y-1">
                          {item.selectedExtras.map((extra) => (
                            <div key={extra.id} className="flex justify-between text-xs">
                              <span className="text-gray-600">{extra.name}</span>
                              <span className="text-gray-600">+Rp {extra.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {state.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({selectedDeliveryOption?.name})</span>
                  <span>{deliveryFee === 0 ? "Free" : `Rp ${deliveryFee.toLocaleString()}`}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>Rp {finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmitOrder}
                disabled={!isFormValid() || isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}