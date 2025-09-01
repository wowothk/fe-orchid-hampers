"use client"

import { createContext, useContext, useReducer, ReactNode, useState, useEffect } from "react"
import type { Product } from "@/data/product"
import type { Extra } from "@/data/extras"

export type CartItem = {
  product: Product
  quantity: number
  selectedExtras?: Extra[]
  deliveryDate?: Date | null
  totalPrice?: number
}

type CartState = {
  items: CartItem[]
  total: number
}

type CartAction = 
  | { type: "ADD_ITEM"; product: Product; selectedExtras: Extra[]; deliveryDate: Date | null }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR_CART" }

const calculateItemPrice = (product: Product, extras: Extra[]): number => {
  const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0)
  return product.price + extrasTotal
}

const getItemTotalPrice = (item: CartItem): number => {
  // Handle legacy items that don't have totalPrice
  if (item.totalPrice !== undefined) {
    return item.totalPrice
  }
  // Calculate from product price and extras for legacy items
  const extrasTotal = (item.selectedExtras || []).reduce((sum, extra) => sum + extra.price, 0)
  return item.product.price + extrasTotal
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const itemPrice = calculateItemPrice(action.product, action.selectedExtras)
      const newItem: CartItem = {
        product: action.product,
        quantity: 1,
        selectedExtras: action.selectedExtras,
        deliveryDate: action.deliveryDate,
        totalPrice: itemPrice
      }
      
      const updatedItems = [...state.items, newItem]
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (getItemTotalPrice(item) * item.quantity), 0)
      }
    }
    
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(item => item.product.id !== action.productId)
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (getItemTotalPrice(item) * item.quantity), 0)
      }
    }
    
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map(item =>
        item.product.id === action.productId
          ? { ...item, quantity: Math.max(0, action.quantity) }
          : item
      ).filter(item => item.quantity > 0)
      
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (getItemTotalPrice(item) * item.quantity), 0)
      }
    }
    
    case "CLEAR_CART": {
      return { items: [], total: 0 }
    }
    
    default:
      return state
  }
}

type CartContextType = {
  state: CartState
  addItem: (product: Product, selectedExtras: Extra[], deliveryDate: Date | null) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])
  
  const addItem = (product: Product, selectedExtras: Extra[], deliveryDate: Date | null) => 
    dispatch({ type: "ADD_ITEM", product, selectedExtras, deliveryDate })
  const removeItem = (productId: number) => dispatch({ type: "REMOVE_ITEM", productId })
  const updateQuantity = (productId: number, quantity: number) => 
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
  const clearCart = () => dispatch({ type: "CLEAR_CART" })
  
  const itemCount = isHydrated ? state.items.reduce((sum, item) => sum + item.quantity, 0) : 0
  
  return (
    <CartContext.Provider value={{
      state: isHydrated ? state : { items: [], total: 0 },
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}