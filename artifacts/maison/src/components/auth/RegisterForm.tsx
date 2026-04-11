"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    await signIn("google", { callbackUrl: "/account" })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirm = formData.get("confirmPassword") as string
    
    if (password !== confirm) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || "Registration failed")
        setLoading(false)
        return
      }
      
      await signIn("credentials", { email, password, redirect: false })
      router.push("/account")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      
      {/* Header Section (Outside Box) */}
      <div className="mb-8 text-center pt-24">
        <h1 className="font-cormorant text-3xl font-light mb-2">
          Create Account
        </h1>
        <p className="font-mono text-xs tracking-widest text-muted">
          JOIN THE MAISON COMMUNITY
        </p>
      </div>

      <div className="w-full max-w-md bg-white border border-site-border p-8 mb-8">
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-mono tracking-widest p-3 mb-6 text-center">
            {error.toUpperCase()}
          </div>
        )}
        
        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center 
                     gap-3 border border-site-border bg-white
                     py-4 font-mono text-xs tracking-widest 
                     uppercase hover:border-ink hover:bg-cream
                     transition-colors mb-6 disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" 
              d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 
                 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57
                 -.05-.66-.15-1.18z"/>
            <path fill="#34A353" 
              d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2
                 a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 
                 008.98 17z"/>
            <path fill="#FBBC05" 
              d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83
                 a8 8 0 000 7.18l2.67-2.07z"/>
            <path fill="#EA4335" 
              d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3
                 A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 
                 014.48-3.31z"/>
          </svg>
          {googleLoading 
            ? "SIGNING IN..." 
            : "CONTINUE WITH GOOGLE"
          }
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 border-t border-site-border"/>
          <span className="font-mono text-xs text-muted 
                           tracking-widest">OR</span>
          <div className="flex-1 border-t border-site-border"/>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" type="text" placeholder="Full Name" required className="w-full border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors" />
          <input name="email" type="email" placeholder="Email Address" required className="w-full border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors" />
          <input name="password" type="password" placeholder="Password (min 8 characters)" required className="w-full border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors" />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" required className="w-full border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors" />
          
          <button type="submit" disabled={loading} className="w-full bg-ink text-white py-4 font-mono text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 mt-8">
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>
      </div>

      {/* Footer (Outside Box) */}
      <div className="text-center mt-8 pb-24">
        <p className="font-mono text-xs text-muted 
                      tracking-widest">
          ALREADY HAVE AN ACCOUNT?{" "}
          <Link
            href="/login"
            className="text-ink underline hover:text-gold 
                       transition-colors uppercase"
          >
            SIGN IN
          </Link>
        </p>
      </div>
    </div>
  )
}
