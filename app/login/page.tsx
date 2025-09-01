"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, Flower, Settings, Eye, EyeOff } from "lucide-react"

type UserType = "customer" | "florist" | "admin"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, login } = useAuth()
  const redirectTo = searchParams.get('redirect') || null
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<UserType>("customer")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (redirectTo) {
        router.push(redirectTo)
      } else {
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
  }, [user, router, redirectTo])

  const userTypes = [
    {
      type: "customer" as UserType,
      label: "Customer",
      description: "Browse and order beautiful flowers",
      icon: <User className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800"
    },
    {
      type: "florist" as UserType,
      label: "Florist",
      description: "Manage orders and arrangements",
      icon: <Flower className="h-5 w-5" />,
      color: "bg-pink-100 text-pink-800"
    },
    {
      type: "admin" as UserType,
      label: "Admin",
      description: "System administration",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-gray-100 text-gray-800"
    }
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Demo authentication - in real app, you'd validate credentials
    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    // Create user data and login
    const userData = {
      email,
      userType,
      name: email.split("@")[0],
      loginTime: new Date().toISOString()
    }
    
    login(userData)
    
    // Redirect to intended destination or based on user type
    if (redirectTo) {
      router.push(redirectTo)
    } else {
      switch (userType) {
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
    
    setIsLoading(false)
  }

  const getDemoCredentials = (type: UserType) => {
    switch (type) {
      case "customer":
        return { email: "customer@example.com", password: "customer123" }
      case "florist":
        return { email: "florist@example.com", password: "florist123" }
      case "admin":
        return { email: "admin@example.com", password: "admin123" }
    }
  }

  const fillDemoCredentials = (type: UserType) => {
    const creds = getDemoCredentials(type)
    setEmail(creds.email)
    setPassword(creds.password)
    setUserType(type)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Choose Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {userTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => setUserType(type.type)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    userType === type.type
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${type.color}`}>
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{type.label}</span>
                        {userType === type.type && (
                          <Badge variant="secondary" className="text-xs">Selected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  `Sign In as ${userTypes.find(t => t.type === userType)?.label}`
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3 text-center">Demo Accounts (Click to fill)</p>
              <div className="grid grid-cols-1 gap-2">
                {userTypes.map((type) => {
                  const creds = getDemoCredentials(type.type)
                  return (
                    <button
                      key={type.type}
                      onClick={() => fillDemoCredentials(type.type)}
                      className="p-2 text-xs text-left rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${type.color}`}>
                          {type.label}
                        </span>
                        <span className="text-gray-600">{creds.email} / {creds.password}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-600">
          <p>🌸 Florist POC - Demo Application</p>
        </div>
      </div>
    </div>
  )
}