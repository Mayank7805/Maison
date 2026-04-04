"use client"
import { useState } from "react"
import { useRouter, useSearchParams, usePathname } 
  from "next/navigation"
import { X, SlidersHorizontal, ChevronDown } from "lucide-react"

export function MobileFilterDrawer() {
  const [open, setOpen] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>(
    ["category", "price", "sort"]
  )
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAll = () => {
    router.push(pathname)
    setOpen(false)
  }

  const activeFilters = searchParams.toString()

  return (
    <>
      {/* Filter Button - Mobile Only */}
      <div className="flex items-center gap-3 md:hidden 
                      mb-6 pb-4 border-b border-site-border">
        
        <button
          onClick={() => setOpen(true)}
          className="flex-1 flex items-center justify-center 
                     gap-2 border border-site-border py-3 
                     font-mono text-xs tracking-widest uppercase
                     hover:border-ink transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filter
          {activeFilters && (
            <span className="w-2 h-2 bg-gold rounded-full"/>
          )}
        </button>

        {/* Sort dropdown - always visible */}
        <select
          onChange={(e) => applyFilter("sort", e.target.value)}
          defaultValue={searchParams.get("sort") || ""}
          className="flex-1 border border-site-border py-3 px-3
                     font-mono text-xs tracking-widest uppercase
                     bg-cream focus:outline-none focus:border-ink
                     transition-colors appearance-none"
        >
          <option value="">Sort By</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {/* Bottom Drawer Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Drawer Panel - slides up from bottom */}
          <div className="absolute bottom-0 left-0 right-0 
                          bg-white rounded-t-2xl max-h-[85vh] 
                          flex flex-col overflow-hidden
                          pb-16">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between 
                            px-6 py-4 border-b border-site-border
                            flex-shrink-0">
              <h3 className="font-mono text-xs tracking-widest uppercase">
                Filter & Sort
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-muted hover:text-ink transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-0">

              {/* SORT */}
              <div className="border-b border-site-border">
                <button
                  onClick={() => toggleSection("sort")}
                  className="flex items-center justify-between 
                             w-full py-4"
                >
                  <span className="font-mono text-xs tracking-widest 
                                   uppercase">
                    Sort By
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-muted transition-transform
                      ${openSections.includes("sort") 
                        ? "rotate-180" : ""}`}
                  />
                </button>
                {openSections.includes("sort") && (
                  <div className="pb-4 space-y-2">
                    {[
                      { label: "Newest First", value: "newest" },
                      { label: "Price: Low to High", value: "price_asc" },
                      { label: "Price: High to Low", value: "price_desc" },
                      { label: "Most Popular", value: "popular" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => applyFilter("sort", option.value)}
                        className={`w-full text-left py-2 px-3 
                                   font-dm-sans text-sm transition-colors
                                   ${searchParams.get("sort") === option.value
                                     ? "bg-ink text-white"
                                     : "hover:bg-cream text-ink"
                                   }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CATEGORY */}
              <div className="border-b border-site-border">
                <button
                  onClick={() => toggleSection("category")}
                  className="flex items-center justify-between 
                             w-full py-4"
                >
                  <span className="font-mono text-xs tracking-widest 
                                   uppercase">
                    Category
                  </span>
                  <ChevronDown 
                    size={16}
                    className={`text-muted transition-transform
                      ${openSections.includes("category") 
                        ? "rotate-180" : ""}`}
                  />
                </button>
                {openSections.includes("category") && (
                  <div className="pb-4 space-y-1">
                    {[
                      { label: "All", value: "" },
                      { label: "Clothes — Men", value: "men" },
                      { label: "Clothes — Women", value: "women" },
                      { label: "Clothes — Kids", value: "kids" },
                      { label: "Handbags", value: "handbags" },
                      { label: "Accessories", value: "accessories" },
                    ].map((cat) => (
                      <button
                        key={cat.label}
                        onClick={() => applyFilter("tags", cat.value)}
                        className={`w-full text-left py-2 px-3 
                                   font-dm-sans text-sm transition-colors
                                   ${searchParams.get("tags") === cat.value
                                     ? "bg-ink text-white"
                                     : "hover:bg-cream text-ink"
                                   }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PRICE */}
              <div className="border-b border-site-border">
                <button
                  onClick={() => toggleSection("price")}
                  className="flex items-center justify-between 
                             w-full py-4"
                >
                  <span className="font-mono text-xs tracking-widest 
                                   uppercase">
                    Price Range
                  </span>
                  <ChevronDown 
                    size={16}
                    className={`text-muted transition-transform
                      ${openSections.includes("price") 
                        ? "rotate-180" : ""}`}
                  />
                </button>
                {openSections.includes("price") && (
                  <div className="pb-4 space-y-1">
                    {[
                      { label: "Under ₹5,000", min: "0", max: "5000" },
                      { label: "₹5,000 – ₹15,000", min: "5000", max: "15000" },
                      { label: "₹15,000 – ₹30,000", min: "15000", max: "30000" },
                      { label: "₹30,000 – ₹60,000", min: "30000", max: "60000" },
                      { label: "Above ₹60,000", min: "60000", max: "" },
                    ].map((range) => (
                      <button
                        key={range.label}
                        onClick={() => {
                          applyFilter("minPrice", range.min)
                          if (range.max) applyFilter("maxPrice", range.max)
                        }}
                        className={`w-full text-left py-2 px-3 
                                   font-dm-sans text-sm transition-colors
                                   ${searchParams.get("minPrice") === range.min
                                     ? "bg-ink text-white"
                                     : "hover:bg-cream text-ink"
                                   }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="flex gap-3 px-6 py-4 border-t 
                            border-site-border flex-shrink-0 bg-white">
              <button
                onClick={clearAll}
                className="flex-1 border border-site-border py-3 
                           font-mono text-xs tracking-widest uppercase
                           text-muted hover:border-ink hover:text-ink 
                           transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-ink text-white py-3 
                           font-mono text-xs tracking-widest uppercase
                           hover:bg-gray-800 transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
