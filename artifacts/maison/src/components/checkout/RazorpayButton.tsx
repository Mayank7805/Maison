"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cartStore"

interface RazorpayButtonProps {
  amount: number
  shippingAddress: {
    fullName: string
    phone: string
    email?: string
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
    country: string
  }
  couponCode?: string
  discount?: number
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function RazorpayButton({
  amount,
  shippingAddress,
  couponCode,
  discount = 0,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { items, clearCart } = useCartStore()

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)
    setError("")

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        setError("Failed to load payment gateway. Please try again.")
        setLoading(false)
        return
      }

      // Create Razorpay order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          cartItems: items,
          shippingAddress,
        }),
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        setError(orderData.error || "Failed to create order")
        setLoading(false)
        return
      }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MAISON",
        description: `Order for ${items.length} item(s)`,
        image: "/logo.png",
        order_id: orderData.orderId,
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
          email: shippingAddress.email || "",
        },
        notes: {
          address: `${shippingAddress.line1}, ${shippingAddress.city}`,
        },
        theme: {
          color: "#0D0D0D",
          backdrop_color: "#FAFAF8",
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          }
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartItems: items,
                shippingAddress,
                amount,
                couponCode,
                discount,
              }),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok) {
              setError(verifyData.error || "Payment verification failed")
              setLoading(false)
              return
            }

            // Clear cart and redirect to success
            clearCart()
            router.push(
              `/checkout/success?orderId=${verifyData.orderId}&orderNumber=${verifyData.orderNumber}`
            )
          } catch {
            setError("Payment verification failed. Contact support.")
            setLoading(false)
          }
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 
                        text-red-600 font-mono text-xs 
                        tracking-widest p-3 mb-4 text-center">
          {error.toUpperCase()}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={loading || items.length === 0}
        className="w-full bg-ink text-white py-5 
                   font-mono text-xs tracking-widest 
                   uppercase hover:bg-gray-800 
                   transition-colors disabled:opacity-50
                   disabled:cursor-not-allowed"
      >
        {loading 
          ? "PROCESSING..." 
          : `PAY ₹${amount.toLocaleString("en-IN")}`
        }
      </button>
      <p className="text-center font-mono text-xs 
                    text-muted tracking-widest mt-3">
        SECURED BY RAZORPAY · UPI · CARDS · NETBANKING
      </p>
    </div>
  )
}
