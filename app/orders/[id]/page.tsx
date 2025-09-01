"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Package, CheckCircle } from "lucide-react"

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

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const foundOrder = orders.find((o: Order) => o.id === params.id)
    setOrder(foundOrder || null)
    setLoading(false)
  }, [params.id])

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
        <Link href="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
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
      <div className="mb-6">
        <Link href="/orders" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-600">Placed on {formatDate(order.date)}</p>
          </div>
        </div>
        <Badge variant="secondary" className={getStatusColor(order.status)}>
          {getStatusIcon(order.status)} {getStatusDisplay(order.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 border rounded-lg">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.product.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">
                        Rp {item.product.price.toLocaleString()} × {item.quantity}
                      </Badge>
                      <span className="font-semibold">
                        Rp {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Name:</strong> {order.customerInfo.name}</div>
              <div><strong>Email:</strong> {order.customerInfo.email}</div>
              <div><strong>Phone:</strong> {order.customerInfo.phone}</div>
              <div><strong>Address:</strong> {order.customerInfo.address}</div>
              <div><strong>City:</strong> {order.customerInfo.city} {order.customerInfo.postalCode}</div>
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
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span>Rp {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <div><strong>Payment Method:</strong> {getPaymentMethodDisplay(order.paymentMethod)}</div>
                  <div className="flex justify-between items-center">
                    <strong>Status:</strong>
                    <Badge variant="secondary" className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)} {getStatusDisplay(order.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-sm text-gray-700 mb-3">Order Progress</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${order.status === "paid" || order.status === "on_process" || order.status === "delivered" ? "bg-blue-500" : "bg-gray-300"} flex-shrink-0`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment Confirmed</p>
                      <p className="text-xs text-gray-500">Order received and payment processed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${order.status === "on_process" || order.status === "delivered" ? "bg-yellow-500" : "bg-gray-300"} flex-shrink-0`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Arranging Flowers</p>
                      <p className="text-xs text-gray-500">Our florist is preparing your arrangement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${order.status === "delivered" ? "bg-green-500" : "bg-gray-300"} flex-shrink-0`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Delivered</p>
                      <p className="text-xs text-gray-500">Your beautiful flowers have been delivered</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  Download Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}