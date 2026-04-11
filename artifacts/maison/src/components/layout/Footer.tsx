"use client";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-cream pt-24 pb-10 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 pb-16 border-b border-cream/10">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-cormorant text-4xl font-light tracking-widest uppercase block mb-5 text-cream">
              Maison
            </Link>
            <p className="font-sans text-sm text-cream/50 leading-relaxed max-w-xs">
              Crafted for those who move through the world with intention. Brutally minimal luxury editorial fashion.
            </p>
            <div className="flex gap-5 mt-8">
              <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-gold hover:text-cream transition-colors">Instagram</a>
              <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-gold hover:text-cream transition-colors">Pinterest</a>
              <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-gold hover:text-cream transition-colors">Twitter</a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold mb-6">Shop</h4>
            <ul className="space-y-4">
              {[
                { label: "Clothes", href: "/shop?category=clothes" },
                { label: "Handbags", href: "/shop?category=handbags" },
                { label: "Accessories", href: "/shop?category=accessories" },
                { label: "Lookbook", href: "/lookbook" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="font-sans text-sm text-cream/60 hover:text-cream transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold mb-6">Support</h4>
            <ul className="space-y-4">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Shipping & Returns", href: "/shipping" },
                { label: "Terms & Conditions", href: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="font-sans text-sm text-cream/60 hover:text-cream transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold mb-6">Newsletter</h4>
            <p className="font-sans text-sm text-cream/50 mb-5 leading-relaxed">
              No spam. Just new arrivals and exclusive offers.
            </p>
            <form className="flex border-b border-cream/20 focus-within:border-gold transition-colors pb-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border-none outline-none w-full font-sans text-sm text-cream placeholder:text-cream/30"
              />
              <button type="submit" className="font-mono text-[10px] uppercase tracking-widest text-gold hover:text-cream transition-colors ml-2 shrink-0">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/30">
            © {new Date().getFullYear()} Maison. All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/30">
            Designed in New Delhi · Made with intention
          </p>
        </div>
      </div>
    </footer>
  );
}
