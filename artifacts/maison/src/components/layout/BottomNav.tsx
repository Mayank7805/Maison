"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid, Search, Heart, User } from "lucide-react"
import { useUIStore } from "@/store/uiStore"
import { useWishlistStore } from "@/store/wishlistStore"

export function BottomNav() {
  const pathname = usePathname()
  const { openSearch } = useUIStore()
  const { items } = useWishlistStore()

  if (pathname.startsWith("/admin")) return null
  if (pathname.startsWith("/checkout")) return null

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 
                    md:hidden bg-white border-t 
                    border-site-border safe-area-pb">
      <div className="grid grid-cols-5 h-16">
        
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center 
                      gap-1 transition-colors
                      ${isActive("/") 
                        ? "text-ink" 
                        : "text-muted"
                      }`}
        >
          <Home size={20} strokeWidth={isActive("/") ? 2 : 1.5} />
          <span className="font-mono text-[9px] tracking-widest uppercase">
            Home
          </span>
        </Link>

        {/* Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center 
                      gap-1 transition-colors
                      ${isActive("/shop") 
                        ? "text-ink" 
                        : "text-muted"
                      }`}
        >
          <Grid size={20} strokeWidth={isActive("/shop") ? 2 : 1.5} />
          <span className="font-mono text-[9px] tracking-widest uppercase">
            Shop
          </span>
        </Link>

        {/* Search */}
        <button
          onClick={openSearch}
          className="flex flex-col items-center justify-center 
                     gap-1 text-muted hover:text-ink transition-colors px-1"
        >
          <Search size={20} strokeWidth={1.5} />
          <span className="font-mono text-[9px] tracking-widest uppercase">
            Search
          </span>
        </button>

        {/* Wishlist */}
        <Link
          href="/account/wishlist"
          className={`flex flex-col items-center justify-center 
                      gap-1 relative transition-colors
                      ${isActive("/account/wishlist") 
                        ? "text-ink" 
                        : "text-muted"
                      }`}
        >
          <div className="relative">
            <Heart 
              size={20} 
              strokeWidth={isActive("/account/wishlist") ? 2 : 1.5}
            />
            {items?.length > 0 && (
              <span className="absolute -top-1 -right-1 
                               bg-gold text-white text-[8px] 
                               w-3.5 h-3.5 rounded-full flex 
                               items-center justify-center
                               font-mono leading-none">
                {items.length}
              </span>
            )}
          </div>
          <span className="font-mono text-[9px] tracking-widest uppercase">
            Wishlist
          </span>
        </Link>

        {/* Account */}
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center 
                      gap-1 transition-colors
                      ${pathname.startsWith("/account") 
                        ? "text-ink" 
                        : "text-muted"
                      }`}
        >
          <User 
            size={20} 
            strokeWidth={pathname.startsWith("/account") ? 2 : 1.5} 
          />
          <span className="font-mono text-[9px] tracking-widest uppercase">
            Account
          </span>
        </Link>

      </div>
    </nav>
  )
}
