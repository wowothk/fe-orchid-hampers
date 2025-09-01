"use client"

import { useEffect, useState, use } from "react"
import { ProtectedRoute } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Flower, Truck, CheckCircle, Package, CalendarDays, Gift, MapPin } from "lucide-react"
import { format } from "date-fns"
import type { Extra } from "@/data/extras"

type OrderItem = {
  product: {
    id: number
    name: string
    description: string
    price: number
    image: string
    stock: number
    lowStockThreshold: number
  }
  quantity: number
  selectedExtras?: Extra[]
  deliveryDate?: Date | null
  totalPrice?: number
}

type DeliveryOption = {
  id: string
  name: string
  description: string
  price: number
  estimatedTime: string
}

type Order = {
  id: string
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  items: OrderItem[]
  total: number
  deliveryFee?: number
  finalTotal?: number
  selectedDelivery?: DeliveryOption
  paymentMethod: string
  status: string
  date: string
}

function FloristOrderDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadOrder()
  }, [resolvedParams.id])

  const loadOrder = () => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const foundOrder = orders.find((o: Order) => o.id === resolvedParams.id)
    setOrder(foundOrder || null)
    setLoading(false)
  }

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return
    
    setUpdating(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update order status
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const updatedOrders = orders.map((o: Order) => 
      o.id === order.id ? { ...o, status: newStatus } : o
    )
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
    
    // Update local state
    setOrder({ ...order, status: newStatus })
    setUpdating(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <Clock className="h-5 w-5 text-blue-600" />
      case "on_process": return <Flower className="h-5 w-5 text-yellow-600" />
      case "delivered": return <Truck className="h-5 w-5 text-green-600" />
      default: return <Package className="h-5 w-5" />
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "paid": return "New Order"
      case "on_process": return "Arranging Flowers"
      case "delivered": return "Delivered"
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-blue-100 text-blue-800"
      case "on_process": return "bg-yellow-100 text-yellow-800"
      case "delivered": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const canProgressToNext = (currentStatus: string) => {
    return currentStatus === "paid" || currentStatus === "on_process"
  }

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "paid": return "on_process"
      case "on_process": return "delivered"
      default: return null
    }
  }

  const getNextStatusDisplay = (currentStatus: string) => {
    switch (currentStatus) {
      case "paid": return "Start Arranging"
      case "on_process": return "Mark as Delivered"
      default: return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">The order you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/florist">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/florist" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {getStatusIcon(order.status)}
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-600">Placed on {formatDate(order.date)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className={getStatusColor(order.status)}>
            {getStatusDisplay(order.status)}
          </Badge>
          
          {canProgressToNext(order.status) && (
            <Button 
              onClick={() => updateOrderStatus(getNextStatus(order.status)!)}
              disabled={updating}
              className="flex items-center gap-2"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {getNextStatusDisplay(order.status)}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flower Arrangements Needed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="p-4 border rounded-lg space-y-4">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                        <p className="text-gray-600 text-sm">{item.product.description}</p>
                      </div>

                      {/* Delivery Date for this Item */}
                      {item.deliveryDate && (
                        <div className="bg-green-50 p-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                              Delivery Date: {format(new Date(item.deliveryDate), "EEEE, MMMM do, yyyy")}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="bg-blue-50">
                            Quantity: {item.quantity}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Base: Rp {item.product.price.toLocaleString()} each
                          </span>
                        </div>
                        <span className="font-semibold">
                          Rp {((item.totalPrice || item.product.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Extras for this Item */}
                  {item.selectedExtras && item.selectedExtras.length > 0 && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Special Extras for Florist:</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {item.selectedExtras.map((extra) => (
                          <div key={extra.id} className="flex justify-between items-start text-sm bg-white p-2 rounded">
                            <div>
                              <span className="font-medium text-purple-800">{extra.name}</span>
                              <p className="text-xs text-purple-600">{extra.description}</p>
                            </div>
                            <span className="text-purple-700 font-medium">+Rp {extra.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-sm font-medium text-purple-800">
                        <span>Total Extras:</span>
                        <span>+Rp {(item.selectedExtras || []).reduce((sum, extra) => sum + extra.price, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer Name</label>
                  <p className="text-sm">{order.customerInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="text-sm">{order.customerInfo.phone}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <p className="text-sm">{order.customerInfo.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p>{order.customerInfo.address}</p>
                      <p>{order.customerInfo.city} {order.customerInfo.postalCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Service Details */}
              {order.selectedDelivery && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Delivery Service</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{order.selectedDelivery.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Description:</span>
                      <span>{order.selectedDelivery.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Time:</span>
                      <span>{order.selectedDelivery.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="font-medium">
                        {order.deliveryFee === 0 ? "Free" : `Rp ${(order.deliveryFee || 0).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                  
                  {order.selectedDelivery.id !== "standard" && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                      <strong>Note:</strong> Third-party delivery service will handle the delivery. 
                      Ensure arrangement is ready by the estimated time.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>Rp {order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({order.selectedDelivery?.name || "Standard"})</span>
                  <span>{order.deliveryFee === 0 ? "Free" : `Rp ${(order.deliveryFee || 0).toLocaleString()}`}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>Rp {(order.finalTotal || order.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Current Status:</span>
                    <Badge variant="secondary" className={getStatusColor(order.status)}>
                      {getStatusDisplay(order.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${order.status === "paid" || order.status === "on_process" || order.status === "delivered" ? "bg-blue-500" : "bg-gray-300"}`}></div>
                      <span className="text-xs">Order Received & Paid</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${order.status === "on_process" || order.status === "delivered" ? "bg-yellow-500" : "bg-gray-300"}`}></div>
                      <span className="text-xs">Arranging Flowers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${order.status === "delivered" ? "bg-green-500" : "bg-gray-300"}`}></div>
                      <span className="text-xs">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>

              {canProgressToNext(order.status) && (
                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => updateOrderStatus(getNextStatus(order.status)!)}
                    disabled={updating}
                    className="w-full"
                    size="lg"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating Status...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {getNextStatusDisplay(order.status)}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function FloristOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute allowedRoles={["florist", "admin"]}>
      <FloristOrderDetailContent params={params} />
    </ProtectedRoute>
  )
}