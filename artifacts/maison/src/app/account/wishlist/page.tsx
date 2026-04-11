"use client"
import { useWishlistStore } from "@/store/wishlistStore"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, X } from "lucide-react"

export default function WishlistPage() {
  const { items, toggleItem } = useWishlistStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      setLoading(false)
      return
    }
    fetch(`/api/products?ids=${items.join(",")}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [items])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex 
                      items-center justify-center">
        <p className="font-mono text-xs tracking-widest 
                      text-muted uppercase">
          Loading...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        <div className="border-b border-site-border pb-8 mb-12">
          <h1 className="font-cormorant text-4xl font-light">
            My Wishlist
          </h1>
          <p className="font-mono text-xs tracking-widest 
                        text-muted mt-2">
            {items.length} {items.length === 1 ? "ITEM" : "ITEMS"} SAVED
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 border 
                          border-site-border bg-white">
            <Heart size={48} className="mx-auto text-site-border mb-6"/>
            <h2 className="font-cormorant text-2xl font-light mb-4">
              Your wishlist is empty
            </h2>
            <p className="font-mono text-xs tracking-widest 
                          text-muted mb-8">
              SAVE ITEMS YOU LOVE
            </p>
            <Link
              href="/shop"
              className="font-mono text-xs tracking-widest 
                         uppercase border border-ink px-8 py-3
                         hover:bg-ink hover:text-white 
                         transition-colors"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <button
                  onClick={() => toggleItem(product.id)}
                  className="absolute top-3 right-3 z-10 
                             w-8 h-8 bg-white border 
                             border-site-border flex items-center 
                             justify-center hover:border-ink 
                             transition-colors"
                >
                  <X size={14} />
                </button>
                <Link href={`/product/${product.slug}`}>
                  <div className="aspect-[3/4] overflow-hidden 
                                  bg-cream-2 mb-4">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover 
                                 group-hover:scale-105 
                                 transition-transform duration-500"
                    />
                  </div>
                  <p className="font-mono text-xs tracking-widest 
                                text-muted uppercase mb-1">
                    {product.category?.name}
                  </p>
                  <h3 className="font-cormorant text-lg font-light mb-1">
                    {product.name}
                  </h3>
                  <p className="font-mono text-sm">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
