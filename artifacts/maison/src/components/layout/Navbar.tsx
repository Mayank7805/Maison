"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useCartStore } from "@/store/cartStore"
import { useUIStore } from "@/store/uiStore"
import { 
  ShoppingBag, Search, Heart, User, Menu, X 
} from "lucide-react"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()
  const { getTotalItems, openCart } = useCartStore()
  const { openSearch } = useUIStore()
  const totalItems = getTotalItems()

  // Only homepage gets transparent navbar
  const isHomepage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    
    // Set initial state
    handleScroll()
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Determine navbar style
  const isTransparent = isHomepage && !scrolled
  
  return (
    <>
      {/* NAVBAR */}
      <nav 
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-in-out
          ${isTransparent 
            ? "bg-transparent border-b border-transparent" 
            : "bg-white border-b border-site-border shadow-sm"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">

            {/* LEFT — Desktop nav */}
            <div className="hidden md:flex items-center gap-8 w-1/3">
              {[
                { href: "/shop", label: "Shop" },
                { href: "/lookbook", label: "Lookbook" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    font-mono text-[13px] tracking-wider uppercase 
                    transition-colors duration-300 font-medium
                    ${isTransparent 
                      ? "text-ink/80 hover:text-ink" 
                      : "text-muted hover:text-ink"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className={`
                md:hidden p-2 transition-colors duration-300
                ${isTransparent ? "text-ink" : "text-ink"}
              `}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen 
                ? <X size={20} /> 
                : <Menu size={20} />
              }
            </button>

            {/* CENTER — Logo */}
            <Link
              href="/"
              className={`
                font-cormorant text-xl md:text-2xl font-light tracking-widest
                absolute left-1/2 -translate-x-1/2
                transition-colors duration-300
                ${isTransparent ? "text-ink" : "text-ink"}
              `}
            >
              MAISON
            </Link>

            {/* RIGHT — Icons */}
            <div className="flex items-center gap-3 md:gap-5 
                            justify-end w-1/3">
              <button
                onClick={openSearch}
                className={`
                  transition-colors duration-300 p-1
                  ${isTransparent 
                    ? "text-ink/70 hover:text-ink" 
                    : "text-muted hover:text-ink"
                  }
                `}
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              <Link
                href="/account"
                className={`
                  hidden md:block transition-colors duration-300 p-1
                  ${isTransparent 
                    ? "text-ink/70 hover:text-ink" 
                    : "text-muted hover:text-ink"
                  }
                `}
                aria-label="Account"
              >
                <User size={18} />
              </Link>

              <Link
                href="/account/wishlist"
                className={`
                  hidden md:block transition-colors duration-300 p-1
                  ${isTransparent 
                    ? "text-ink/70 hover:text-ink" 
                    : "text-muted hover:text-ink"
                  }
                `}
                aria-label="Wishlist"
              >
                <Heart size={18} />
              </Link>

              <button
                onClick={openCart}
                className={`
                  relative transition-colors duration-300 p-1
                  ${isTransparent 
                    ? "text-ink/70 hover:text-ink" 
                    : "text-muted hover:text-ink"
                  }
                `}
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 
                                   bg-gold text-white text-xs 
                                   w-4 h-4 rounded-full flex 
                                   items-center justify-center
                                   font-mono leading-none">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 
                        backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-in Panel */}
          <div className="absolute top-0 left-0 bottom-0 
                          w-72 bg-white flex flex-col 
                          shadow-2xl"
               style={{ zIndex: 60 }}>

            {/* Panel Header */}
            <div className="flex items-center px-4 h-16 
                            border-b border-site-border">
              <button
                onClick={() => setMobileOpen(false)}
                className="text-ink p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Panel Links */}
            <nav className="flex-1 px-6 py-8 space-y-0">
              {[
                { href: "/shop", label: "Shop Collection" },
                { href: "/shop?tags=women", label: "Women" },
                { href: "/shop?tags=men", label: "Men" },
                { href: "/shop?tags=kids", label: "Kids" },
                { href: "/shop?category=handbags", label: "Handbags" },
                { href: "/shop?category=accessories", label: "Accessories" },
                { href: "/lookbook", label: "Lookbook" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block font-cormorant text-xl 
                             font-light text-ink hover:text-gold 
                             transition-colors py-3 
                             border-b border-site-border/40
                             last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Panel Footer */}
            <div className="px-6 py-6 border-t border-site-border 
                            space-y-4 bg-cream">
               {/* 
                  The prompt code had a syntax bug: session.user.name?.split(" ")[0]. 
                  I am adding a safe check!
               */}
              <Link
                href={session?.user ? "/account" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 font-mono 
                           text-xs tracking-widest text-muted 
                           uppercase hover:text-ink transition-colors"
              >
                <User size={14} />
                {session?.user 
                  ? `Hi, ${(session.user.name || "User").split(" ")[0]}` 
                  : "Sign In / Register"
                }
              </Link>
              <Link
                href="/account/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 font-mono 
                           text-xs tracking-widest text-muted 
                           uppercase hover:text-ink transition-colors"
              >
                <Heart size={14} />
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
