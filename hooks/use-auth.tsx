"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from "react"
import { useRouter } from "next/navigation"

export type UserType = "customer" | "florist" | "admin"

export type User = {
  email: string
  name: string
  userType: UserType
  loginTime: string
}

type AuthState = {
  user: User | null
  isLoading: boolean
}

type AuthAction = 
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "LOGIN"; user: User }
  | { type: "LOGOUT" }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.loading }
    case "LOGIN":
      return { user: action.user, isLoading: false }
    case "LOGOUT":
      return { user: null, isLoading: false }
    default:
      return state
  }
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  isCustomer: boolean
  isFlorist: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true
  })
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated
    setIsHydrated(true)
    
    // Check for existing user session on app load
    const checkAuth = () => {
      const stored = localStorage.getItem("user")
      if (stored) {
        try {
          const user = JSON.parse(stored)
          dispatch({ type: "LOGIN", user })
        } catch (error) {
          console.error("Error parsing stored user:", error)
          localStorage.removeItem("user")
        }
      }
      dispatch({ type: "SET_LOADING", loading: false })
    }

    checkAuth()
  }, [])

  const login = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user))
    dispatch({ type: "LOGIN", user })
  }

  const logout = () => {
    localStorage.removeItem("user")
    dispatch({ type: "LOGOUT" })
    router.push("/login")
  }

  const isCustomer = state.user?.userType === "customer"
  const isFlorist = state.user?.userType === "florist"
  const isAdmin = state.user?.userType === "admin"

  return (
    <AuthContext.Provider value={{
      user: isHydrated ? state.user : null,
      isLoading: !isHydrated || state.isLoading,
      login,
      logout,
      isCustomer: isHydrated ? isCustomer : false,
      isFlorist: isHydrated ? isFlorist : false,
      isAdmin: isHydrated ? isAdmin : false
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Protected route wrapper
export function ProtectedRoute({ 
  children, 
  allowedRoles = ["customer", "florist", "admin"],
  redirectTo = "/login" 
}: { 
  children: ReactNode
  allowedRoles?: UserType[]
  redirectTo?: string 
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo)
      } else if (!allowedRoles.includes(user.userType)) {
        // Redirect based on user type if not allowed
        switch (user.userType) {
          case "florist":
            router.push("/florist")
            break
          case "admin":
            router.push("/admin")
            break
          default:
            router.push("/")
            break
        }
      }
    }
  }, [user, isLoading, router, allowedRoles, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.userType)) {
    return null
  }

  return <>{children}</>
}