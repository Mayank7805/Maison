"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"

export function ProfileForm({ user }: { user: any }) {
  const { update } = useSession()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
        }),
      })
      if (res.ok) {
        setSuccess(true)
        await update()
        setTimeout(() => setSuccess(false), 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-site-border p-8">
      {success && (
        <div className="bg-green-50 border border-green-200 
                        text-green-600 font-mono text-xs 
                        tracking-widest p-3 mb-6 text-center">
          PROFILE UPDATED SUCCESSFULLY
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-mono text-xs tracking-widest 
                            text-muted uppercase block mb-2">
            Full Name
          </label>
          <input
            name="name"
            defaultValue={user?.name || ""}
            className="w-full border border-site-border 
                       bg-cream p-4 text-sm focus:outline-none 
                       focus:border-ink transition-colors"
          />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest 
                            text-muted uppercase block mb-2">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            defaultValue={user?.email || ""}
            className="w-full border border-site-border 
                       bg-cream p-4 text-sm focus:outline-none 
                       focus:border-ink transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-white font-mono text-xs 
                     tracking-widest uppercase px-8 py-4
                     hover:bg-gray-800 transition-colors
                     disabled:opacity-50"
        >
          {loading ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </form>
    </div>
  )
}
