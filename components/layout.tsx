import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4">🌸 Florist POC</h2>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            Catalog
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Cart
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Orders
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Florist
          </Button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {/* <header className="h-14 border-b px-6 flex items-center justify-between bg-background">
          <h1 className="text-xl font-semibold">Marketplace</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost">🔔</Button>
            <Button variant="outline">Login</Button>
          </div>
        </header> */}

        {/* Content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  )
}
