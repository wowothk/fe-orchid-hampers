"use client"

import { createContext, useContext, useReducer, ReactNode, useState, useEffect } from "react"
import type { Product } from "@/data/product"

export type CartItem = {
  product: Product
  quantity: number
}

type CartState = {
  items: CartItem[]
  total: number
}

type CartAction = 
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR_CART" }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        item => item.product.id === action.product.id
      )
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        }
      } else {
        const updatedItems = [...state.items, { product: action.product, quantity: 1 }]
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        }
      }
    }
    
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(item => item.product.id !== action.productId)
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
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
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
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
  addItem: (product: Product) => void
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
  
  const addItem = (product: Product) => dispatch({ type: "ADD_ITEM", product })
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