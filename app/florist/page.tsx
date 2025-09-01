"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Package, Eye, Clock, CheckCircle, Truck, Flower } from "lucide-react"

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

function FloristDashboardContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    // Sort by date (most recent first)
    const sortedOrders = storedOrders.sort((a: Order, b: Order) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    setOrders(sortedOrders)
    setLoading(false)
  }

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true
    return order.status === filter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <Clock className="h-4 w-4" />
      case "on_process": return <Flower className="h-4 w-4" />
      case "delivered": return <Truck className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "paid": return "New Order"
      case "on_process": return "Arranging"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const orderCounts = {
    all: orders.length,
    paid: orders.filter(o => o.status === "paid").length,
    on_process: orders.filter(o => o.status === "on_process").length,
    delivered: orders.filter(o => o.status === "delivered").length
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Flower className="h-8 w-8 text-pink-500" />
          Florist Dashboard
        </h1>
        <p className="text-gray-600">Manage flower arrangements and deliveries</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className="flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          All Orders ({orderCounts.all})
        </Button>
        <Button
          variant={filter === "paid" ? "default" : "outline"}
          onClick={() => setFilter("paid")}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          New Orders ({orderCounts.paid})
        </Button>
        <Button
          variant={filter === "on_process" ? "default" : "outline"}
          onClick={() => setFilter("on_process")}
          className="flex items-center gap-2"
        >
          <Flower className="h-4 w-4" />
          Arranging ({orderCounts.on_process})
        </Button>
        <Button
          variant={filter === "delivered" ? "default" : "outline"}
          onClick={() => setFilter("delivered")}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Delivered ({orderCounts.delivered})
        </Button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Orders Found</h2>
          <p className="text-gray-600">
            {filter === "all" 
              ? "No orders have been placed yet." 
              : `No orders with status "${getStatusDisplay(filter)}" found.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Order #{order.id}
                      {getStatusIcon(order.status)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Ordered on {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getStatusColor(order.status)}>
                      {getStatusDisplay(order.status)}
                    </Badge>
                    <Link href={`/florist/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View & Update
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-3">Customer</h4>
                    <div className="text-sm">
                      <p className="font-medium">{order.customerInfo.name}</p>
                      <p className="text-gray-600">{order.customerInfo.phone}</p>
                      <p className="text-gray-600">{order.customerInfo.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-3">Delivery Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.customerInfo.address}<br />
                      {order.customerInfo.city} {order.customerInfo.postalCode}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-3">Order Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Items:</span>
                        <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>Rp {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.product.id} className="flex items-center gap-2">
                            <div className="relative h-8 w-8 flex-shrink-0">
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <span className="text-xs text-gray-600 truncate">
                              {item.quantity}× {item.product.name}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FloristDashboard() {
  return (
    <ProtectedRoute allowedRoles={["florist", "admin"]}>
      <FloristDashboardContent />
    </ProtectedRoute>
  )
}