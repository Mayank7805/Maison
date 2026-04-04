"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function ProductForm({ 
  categories, 
  product 
}: { 
  categories: any[]
  product?: any 
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<string[]>(
    product?.images || [""]
  )

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    
    const data = {
      name: formData.get("name"),
      slug: (formData.get("name") as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      comparePrice: formData.get("comparePrice") 
        ? Number(formData.get("comparePrice")) 
        : null,
      sku: formData.get("sku"),
      stock: Number(formData.get("stock")),
      categoryId: formData.get("categoryId"),
      images: images.filter(img => img.trim() !== ""),
      tags: (formData.get("tags") as string)
        .split(",")
        .map(t => t.trim())
        .filter(Boolean),
      isFeatured: formData.get("isFeatured") === "on",
    }

    try {
      const url = product 
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products"
      
      const res = await fetch(url, {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Failed to save product")
        setLoading(false)
        return
      }

      router.push("/admin/products")
      router.refresh()
    } catch {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-white border border-site-border p-8 
                      space-y-6">

        {error && (
          <div className="bg-red-50 border border-red-200 
                          text-red-600 font-mono text-xs 
                          tracking-widest p-3 text-center">
            {error.toUpperCase()}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="font-mono text-xs tracking-widest 
                            text-muted uppercase block mb-2">
            Product Name *
          </label>
          <input
            name="name"
            required
            defaultValue={product?.name}
            className="w-full border border-site-border bg-cream 
                       p-4 text-sm focus:outline-none 
                       focus:border-ink transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-mono text-xs tracking-widest 
                            text-muted uppercase block mb-2">
            Description *
          </label>
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={product?.description}
            className="w-full border border-site-border bg-cream 
                       p-4 text-sm focus:outline-none 
                       focus:border-ink transition-colors resize-none"
          />
        </div>

        {/* Price + Compare Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs tracking-widest 
                              text-muted uppercase block mb-2">
              Price (₹) *
            </label>
            <input
              name="price"
              type="number"
              required
              min="0"
              defaultValue={product?.price}
              className="w-full border border-site-border bg-cream 
                         p-4 text-sm focus:outline-none 
                         focus:border-ink transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-xs tracking-widest 
                              text-muted uppercase block mb-2">
              Compare Price (₹)
            </label>
            <input
              name="comparePrice"
              type="number"
              min="0"
              defaultValue={product?.comparePrice}
              className="w-full border border-site-border bg-cream 
                         p-4 text-sm focus:outline-none 
                         focus:border-ink transition-colors"
            />
          </div>
        </div>

        {/* SKU + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs tracking-widest 
                              text-muted uppercase block mb-2">
              SKU *
            </label>
            <input
              name="sku"
              required
              defaultValue={product?.sku}
              className="w-full border border-site-border bg-cream 
                         p-4 text-sm focus:outline-none 
                         focus:border-ink transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-xs tracking-widest 
                              text-muted uppercase block mb-2">
              Stock *
            </label>
            <input
              name="stock"
              type="number"
              required
              min="0"
              defaultValue={product?.stock || 0}
              className="w-full border border-site-border bg-cream 
                         p-4 text-sm focus:outline-none 
                         focus:border-ink transition-colors"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="font-mono text-xs tracking-widest 
                            text-muted uppercase block mb-2">
            Category *
          </label>
          <select
            name="categoryId"
            required
            defaultValue={product?.categoryId || ""}
            className="w-full border border-site-border bg-cream 
                       p-4 text-sm focus:outline-none 
                       focus:border-ink transition-colors"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="font-mono text-xs tracking-widest 
                            text-muted uppercase block mb-2">
            Tags (comma separated)
          </label>
          <input
            name="tags"
            placeholder="men, shirt, casual, cotton"
            defaultValue={product?.tags?.join(", ")}
            className="w-full border border-site-border bg-cream 
                       p-4 text-sm focus:outline-none 
                       focus:border-ink transition-colors"
          />
          <p className="font-mono text-xs text-muted mt-1">
            Use tags like: men, women, kids, formal, casual
          </p>
        </div>

        {/* Images */}
        <div>
          <label className="font-mono text-xs tracking-widest 
                            text-muted uppercase block mb-2">
            Image URLs
          </label>
          <div className="space-y-3">
            {images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  value={img}
                  onChange={e => {
                    const newImages = [...images]
                    newImages[i] = e.target.value
                    setImages(newImages)
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 border border-site-border 
                             bg-cream p-4 text-sm focus:outline-none 
                             focus:border-ink transition-colors"
                />
                {img && (
                  <img
                    src={img}
                    alt="preview"
                    className="w-16 h-16 object-cover 
                               border border-site-border"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display 
                        = "none"
                    }}
                  />
                )}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setImages(
                      images.filter((_, idx) => idx !== i)
                    )}
                    className="text-red-500 hover:text-red-700 
                               px-2 font-mono text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setImages([...images, ""])}
              className="font-mono text-xs tracking-widest 
                         uppercase text-gold hover:text-ink 
                         transition-colors"
            >
              + ADD ANOTHER IMAGE
            </button>
          </div>
          <p className="font-mono text-xs text-muted mt-2">
            Tip: Go to unsplash.com → find image → 
            right click → Copy image address
          </p>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            defaultChecked={product?.isFeatured}
            className="w-4 h-4"
          />
          <label 
            htmlFor="isFeatured"
            className="font-mono text-xs tracking-widest 
                       text-muted uppercase cursor-pointer"
          >
            Featured Product (shows on homepage)
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4 border-t border-site-border">
          <button
            type="submit"
            disabled={loading}
            className="bg-ink text-white font-mono text-xs 
                       tracking-widest uppercase px-8 py-4
                       hover:bg-gray-800 transition-colors
                       disabled:opacity-50"
          >
            {loading 
              ? "SAVING..." 
              : product 
              ? "UPDATE PRODUCT" 
              : "ADD PRODUCT"
            }
          </button>
          
            <a href="/admin/products"
            className="font-mono text-xs tracking-widest 
                       uppercase border border-site-border 
                       px-8 py-4 text-muted
                       hover:border-ink hover:text-ink 
                       transition-colors"
          >
            CANCEL
          </a>
        </div>
      </div>
    </form>
  )
}
