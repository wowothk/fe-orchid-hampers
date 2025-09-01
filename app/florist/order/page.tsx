"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FloristOrderPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/florist")
  }, [router])

  return null
}