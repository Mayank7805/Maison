"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Pencil, Trash2, Eye } from "lucide-react"

export function AdminProductsTable({ 
  products 
}: { 
  products: any[] 
}) {
  const [search, setSearch] = useState("")
  
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  async function handleArchive(id: string) {
    if (!confirm("Archive this product?")) return
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE"
    })
    window.location.reload()
  }

  return (
    <div className="bg-white border border-site-border">
      
      {/* Search */}
      <div className="p-4 border-b border-site-border">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xs border border-site-border 
                     bg-cream p-3 font-mono text-xs 
                     tracking-widest focus:outline-none 
                     focus:border-ink transition-colors"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-site-border">
              {["IMAGE", "NAME", "CATEGORY", "PRICE", 
                "STOCK", "FEATURED", "ACTIONS"].map(h => (
                <th 
                  key={h}
                  className="font-mono text-xs tracking-widest 
                             text-muted text-left p-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr 
                key={product.id}
                className="border-b border-site-border 
                           hover:bg-cream transition-colors"
              >
                <td className="p-4">
                  {product.images?.[0] && (
                    <div className="w-12 h-16 overflow-hidden 
                                    bg-cream-2">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <p className="font-dm-sans text-sm font-medium">
                    {product.name}
                  </p>
                  <p className="font-mono text-xs text-muted mt-1">
                    {product.sku}
                  </p>
                </td>
                <td className="p-4">
                  <span className="font-mono text-xs 
                                   tracking-widest text-muted 
                                   uppercase">
                    {product.category?.name}
                  </span>
                </td>
                <td className="p-4">
                  <p className="font-mono text-xs">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </p>
                  {product.comparePrice && (
                    <p className="font-mono text-xs text-muted 
                                  line-through">
                      ₹{product.comparePrice?.toLocaleString("en-IN")}
                    </p>
                  )}
                </td>
                <td className="p-4">
                  <span className={`
                    font-mono text-xs tracking-widest px-2 py-1
                    ${product.stock <= 5 
                      ? "text-red-600 bg-red-50" 
                      : product.stock <= 20
                      ? "text-amber-600 bg-amber-50"
                      : "text-green-600 bg-green-50"
                    }
                  `}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`
                    font-mono text-xs tracking-widest px-2 py-1
                    ${product.isFeatured 
                      ? "text-gold bg-amber-50" 
                      : "text-muted"
                    }
                  `}>
                    {product.isFeatured ? "YES" : "NO"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-muted hover:text-ink 
                                 transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-muted hover:text-ink 
                                 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleArchive(product.id)}
                      className="text-muted hover:text-red-600 
                                 transition-colors"
                      title="Archive"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-mono text-xs tracking-widest text-muted">
              NO PRODUCTS FOUND
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
