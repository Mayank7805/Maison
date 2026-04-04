import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/")

  const navLinks = [
    { href: "/admin", label: "DASHBOARD" },
    { href: "/admin/products", label: "PRODUCTS" },
    { href: "/admin/orders", label: "ORDERS" },
    { href: "/admin/customers", label: "CUSTOMERS" },
  ]

  return (
    <div className="min-h-screen bg-cream">
      
      {/* TOP HEADER BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 
                         bg-white border-b border-site-border 
                         h-14 flex items-center 
                         justify-between px-6">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link 
            href="/admin"
            className="font-cormorant text-xl font-light 
                       tracking-widest text-ink"
          >
            MAISON
          </Link>
          
          {/* Admin nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs tracking-widest 
                           text-muted hover:text-ink 
                           transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Admin badge */}
          <span className="font-mono text-xs tracking-widest 
                           text-gold border border-gold 
                           px-3 py-1 hidden md:block">
            ADMIN
          </span>
          
          {/* Back to store button */}
          <Link
            href="/"
            className="font-mono text-xs tracking-widest 
                       uppercase bg-ink text-white 
                       px-4 py-2 hover:bg-gray-800 
                       transition-colors"
          >
            ← BACK TO STORE
          </Link>

          {/* User email */}
          <span className="font-mono text-xs text-muted 
                           hidden lg:block">
            {session.user.email}
          </span>
        </div>
      </header>

      {/* BODY */}
      <div className="flex pt-14">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-56 bg-ink text-white 
                          min-h-screen fixed left-0 
                          top-14 bottom-0 flex flex-col">
          
          <nav className="flex-1 p-4 space-y-1 mt-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block font-mono text-xs 
                           tracking-widest text-white/50
                           hover:text-white hover:bg-white/5
                           px-4 py-3 transition-colors 
                           rounded"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <p className="font-mono text-xs text-white/30 
                          tracking-widest truncate">
              {session.user.name}
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 ml-56 p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
