"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { Home, ShoppingCart, List, User, LayoutDashboard, Package } from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { LogOut, User as UserIcon } from "lucide-react"
import { usePathname } from "next/navigation"

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true)
  const { itemCount } = useCart()
  const { user, logout, isCustomer, isFlorist, isAdmin, isLoading } = useAuth()
  const pathname = usePathname()
  
  // Hide sidebar on login page
  const isLoginPage = pathname === '/login'
  
  // Show loading state during initial hydration to prevent hydration mismatch
  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If login page, render without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar collapsible="icon">
          <SidebarHeader className="mt-2 mb-4">
            <div className="flex items-center gap-4">
                <div className="h-4 w-4 shrink-0 px-2">🌸</div>
                <h1 className="h-4 text-lg group-data-[collapsible=icon]:hidden"><b>Florist POC </b></h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Catalog & Cart - Available to everyone */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/" className="flex items-center gap-2">
                        <Home className="h-4 w-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          Catalog
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/cart" className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden flex items-center gap-2">
                          Cart
                          {itemCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-auto group-data-[collapsible=icon]:hidden"
                            >
                              {itemCount}
                            </Badge>
                          )}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Customer Orders - Only for logged in customers */}
                  {isCustomer && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/orders" className="flex items-center gap-2">
                          <List className="h-4 w-4 shrink-0" />
                          <span className="group-data-[collapsible=icon]:hidden">
                            My Orders
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {/* Florist Navigation */}
                  {isFlorist && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/florist" className="flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4 shrink-0" />
                            <span className="group-data-[collapsible=icon]:hidden">
                              Dashboard
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}

                  {/* Admin Navigation */}
                  {isAdmin && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/admin" className="flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4 shrink-0" />
                            <span className="group-data-[collapsible=icon]:hidden">
                              Admin Panel
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/florist" className="flex items-center gap-2">
                            <User className="h-4 w-4 shrink-0" />
                            <span className="group-data-[collapsible=icon]:hidden">
                              Florist View
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/admin/stock" className="flex items-center gap-2">
                            <Package className="h-4 w-4 shrink-0" />
                            <span className="group-data-[collapsible=icon]:hidden">
                              Stock Management
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="flex w-full h-14 items-center border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex-1 text-center">
              <h1 className="font-semibold text-lg hidden sm:inline">Marketplace</h1>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 mr-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                      <UserIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">{user.name}</span>
                      <Badge variant="secondary" className={
                        user.userType === "customer" ? "bg-blue-100 text-blue-800" :
                        user.userType === "florist" ? "bg-pink-100 text-pink-800" :
                        "bg-gray-100 text-gray-800"
                      }>
                        {user.userType === "customer" ? "Customer" :
                         user.userType === "florist" ? "Florist" : "Admin"}
                      </Badge>
                    </div>
                  </div>
                  {user.userType === "customer" && (
                    <Link href="/orders" className="relative md:hidden sm:inlin mr-2">
                      <ShoppingCart className="h-5 w-5" />
                      {itemCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-1 -right-2  px-1.5 py-0 text-xs"
                        >
                          {itemCount}
                        </Badge>
                      )}
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              )}
            </div>
          </header>

          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
