"use client"
import { useRouter, useSearchParams } from "next/navigation"

export function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") || "all"
  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentSort = searchParams.get("sort")

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/shop?${params.toString()}`)
  }

  const isPriceActive = (min: string | null, max: string | null) => {
    return currentMinPrice === min && currentMaxPrice === max
  }

  return (
    <div className="space-y-12 pr-6">
      
      {/* CATEGORY */}
      <div>
        <h3 className="font-mono text-xs tracking-widest uppercase mb-6 text-ink">Category</h3>
        <ul className="space-y-4 font-sans text-sm text-muted">
          <li>
            <button 
              onClick={() => updateParam("category", null)}
              className={`hover:text-ink transition-colors flex items-center gap-3 ${currentCategory === 'all' ? 'text-ink font-medium' : ''}`}
            >
              <div className={`w-3 h-3 border border-site-border ${currentCategory === 'all' ? 'bg-ink border-ink' : ''}`} />
              All
            </button>
          </li>
          
          <li className="pt-2">
            <button onClick={() => updateParam("category", "clothes")} className={`hover:text-ink transition-colors flex items-center gap-3 ${currentCategory === 'clothes' ? 'text-ink font-medium' : ''}`}>
               <div className={`w-3 h-3 border border-site-border ${currentCategory === 'clothes' ? 'bg-ink border-ink' : ''}`} />
               Clothes
            </button>
            <ul className="pl-6 mt-3 space-y-3 border-l ml-[5px] border-site-border text-xs">
              <li><button onClick={() => updateParam("category", "men")} className="hover:text-ink">Men</button></li>
              <li><button onClick={() => updateParam("category", "women")} className="hover:text-ink">Women</button></li>
              <li><button onClick={() => updateParam("category", "kids")} className="hover:text-ink">Kids</button></li>
            </ul>
          </li>

          <li className="pt-2">
            <button onClick={() => updateParam("category", "handbags")} className={`hover:text-ink transition-colors flex items-center gap-3 ${currentCategory === 'handbags' ? 'text-ink font-medium' : ''}`}>
               <div className={`w-3 h-3 border border-site-border ${currentCategory === 'handbags' ? 'bg-ink border-ink' : ''}`} />
               Handbags
            </button>
            <ul className="pl-6 mt-3 space-y-3 border-l ml-[5px] border-site-border text-xs">
              <li><button onClick={() => updateParam("category", "tote")} className="hover:text-ink">Tote</button></li>
              <li><button onClick={() => updateParam("category", "clutch")} className="hover:text-ink">Clutch</button></li>
              <li><button onClick={() => updateParam("category", "backpack")} className="hover:text-ink">Backpack</button></li>
            </ul>
          </li>

          <li className="pt-2">
            <button onClick={() => updateParam("category", "accessories")} className={`hover:text-ink transition-colors flex items-center gap-3 ${currentCategory === 'accessories' ? 'text-ink font-medium' : ''}`}>
               <div className={`w-3 h-3 border border-site-border ${currentCategory === 'accessories' ? 'bg-ink border-ink' : ''}`} />
               Accessories
            </button>
            <ul className="pl-6 mt-3 space-y-3 border-l ml-[5px] border-site-border text-xs">
              <li><button onClick={() => updateParam("category", "jewellery")} className="hover:text-ink">Jewellery</button></li>
              <li><button onClick={() => updateParam("category", "scarves")} className="hover:text-ink">Scarves</button></li>
              <li><button onClick={() => updateParam("category", "belts")} className="hover:text-ink">Belts</button></li>
            </ul>
          </li>
        </ul>
      </div>

      {/* PRICE RANGE */}
      <div>
        <h3 className="font-mono text-xs tracking-widest uppercase mb-6 text-ink">Price Range</h3>
        <ul className="space-y-4 font-sans text-sm text-muted">
          <li>
            <button onClick={() => { updateParam("minPrice", null); updateParam("maxPrice", "5000") }} className="flex items-center gap-3 hover:text-ink">
              <div className={`w-3 h-3 border border-site-border ${isPriceActive(null, "5000") ? 'bg-ink border-ink' : ''}`} />
              Under ₹5,000
            </button>
          </li>
          <li>
            <button onClick={() => { updateParam("minPrice", "5000"); updateParam("maxPrice", "15000") }} className="flex items-center gap-3 hover:text-ink">
              <div className={`w-3 h-3 border border-site-border ${isPriceActive("5000", "15000") ? 'bg-ink border-ink' : ''}`} />
              ₹5,000 – ₹15,000
            </button>
          </li>
          <li>
            <button onClick={() => { updateParam("minPrice", "15000"); updateParam("maxPrice", "30000") }} className="flex items-center gap-3 hover:text-ink">
              <div className={`w-3 h-3 border border-site-border ${isPriceActive("15000", "30000") ? 'bg-ink border-ink' : ''}`} />
              ₹15,000 – ₹30,000
            </button>
          </li>
          <li>
            <button onClick={() => { updateParam("minPrice", "30000"); updateParam("maxPrice", "60000") }} className="flex items-center gap-3 hover:text-ink">
              <div className={`w-3 h-3 border border-site-border ${isPriceActive("30000", "60000") ? 'bg-ink border-ink' : ''}`} />
              ₹30,000 – ₹60,000
            </button>
          </li>
          <li>
            <button onClick={() => { updateParam("minPrice", "60000"); updateParam("maxPrice", null) }} className="flex items-center gap-3 hover:text-ink">
              <div className={`w-3 h-3 border border-site-border ${isPriceActive("60000", null) ? 'bg-ink border-ink' : ''}`} />
              Above ₹60,000
            </button>
          </li>
        </ul>
      </div>

      {/* SORT BY */}
      <div>
        <h3 className="font-mono text-xs tracking-widest uppercase mb-6 text-ink">Sort By</h3>
        <ul className="space-y-4 font-sans text-sm text-muted">
          <li>
            <button onClick={() => updateParam("sort", "newest")} className="flex items-center gap-3 hover:text-ink">
              <div className={`w-3 h-3 border border-site-border ${currentSort === 'newest' || !currentSort ? 'bg-ink border-ink' : ''}`} />
              Newest First
            </button>
          </li>
          <li>
            <button onClick={() => updateParam("sort", "price_asc")} className="flex items-center gap-3 hover:text-ink">
              <div className={`w-3 h-3 border border-site-border ${currentSort === 'price_asc' ? 'bg-ink border-ink' : ''}`} />
              Price: Low to High
            </button>
          </li>
          <li>
            <button onClick={() => updateParam("sort", "price_desc")} className="flex items-center gap-3 hover:text-ink">
              <div className={`w-3 h-3 border border-site-border ${currentSort === 'price_desc' ? 'bg-ink border-ink' : ''}`} />
              Price: High to Low
            </button>
          </li>
          <li>
            <button onClick={() => updateParam("sort", "popular")} className="flex items-center gap-3 hover:text-ink">
              <div className={`w-3 h-3 border border-site-border ${currentSort === 'popular' ? 'bg-ink border-ink' : ''}`} />
              Most Popular
            </button>
          </li>
        </ul>
      </div>

    </div>
  )
}
