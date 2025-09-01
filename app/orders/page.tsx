"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Package, ShoppingBag, Eye } from "lucide-react"

type OrderItem = {
  product: {
    id: number
    name: string
    description: string
    price: number
    image: string
  }
  quantity: number
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
  paymentMethod: string
  status: string
  date: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    // Sort by date (most recent first)
    const sortedOrders = storedOrders.sort((a: Order, b: Order) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    setOrders(sortedOrders)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-gray-600 mb-6">You haven't placed any orders. Start shopping for beautiful flowers!</p>
        <Link href="/">
          <Button>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Start Shopping
          </Button>
        </Link>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "credit_card": return "Credit Card"
      case "bank_transfer": return "Bank Transfer"
      case "e_wallet": return "E-Wallet"
      default: return method
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return "💳"
      case "on_process": return "🌸"
      case "delivered": return "✅"
      default: return "📦"
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "paid": return "Payment Confirmed"
      case "on_process": return "Arranging Flowers"
      case "delivered": return "Delivered"
      default: return status.charAt(0).toUpperCase() + status.slice(1)
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your flower orders</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Placed on {formatDate(order.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor(order.status)}>
                     {getStatusIcon(order.status)} {getStatusDisplay(order.status)}
                  </Badge>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-3">Items Ordered</h4>
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3">
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
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-gray-500">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-3">Order Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-semibold">Rp {order.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment:</span>
                      <span>{getPaymentMethodDisplay(order.paymentMethod)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium">{getStatusDisplay(order.status)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="font-medium text-sm text-gray-700 mb-1">Delivery To:</h5>
                    <p className="text-sm text-gray-600">
                      {order.customerInfo.name}<br />
                      {order.customerInfo.address}, {order.customerInfo.city}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}