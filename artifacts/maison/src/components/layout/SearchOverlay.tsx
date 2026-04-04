"use client"
import { useUIStore } from "@/store/uiStore"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUIStore()
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch()
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        useUIStore.getState().openSearch()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [closeSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      closeSearch()
      setQuery("")
    }
  }

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-cream/95 
                    backdrop-blur-sm flex flex-col 
                    items-center justify-center">
      <button 
        onClick={closeSearch}
        className="absolute top-8 right-12 text-muted 
                   hover:text-ink transition-colors"
      >
        <X size={24} />
      </button>
      
      <p className="font-mono text-xs tracking-widest 
                    text-gold uppercase mb-8">
        Search
      </p>
      
      <form onSubmit={handleSearch} className="w-full max-w-2xl px-8">
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you looking for?"
          className="w-full bg-transparent border-b-2 
                     border-site-border text-center
                     font-cormorant text-4xl font-light
                     text-ink pb-4 focus:outline-none 
                     focus:border-ink transition-colors
                     placeholder:text-site-border"
        />
      </form>
      
      <div className="flex gap-3 mt-12 flex-wrap justify-center">
        {["Silk Dress", "Leather Bag", "Cashmere", 
          "Trench Coat", "Gold Earrings"].map((tag) => (
          <button
            key={tag}
            onClick={() => setQuery(tag)}
            className="font-mono text-xs tracking-widest 
                       uppercase px-4 py-2 border 
                       border-site-border text-muted
                       hover:border-ink hover:text-ink 
                       transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
