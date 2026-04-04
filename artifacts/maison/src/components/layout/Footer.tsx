"use client";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-20 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="font-display text-3xl font-medium tracking-widest uppercase block mb-6">
            Maison
          </Link>
          <p className="font-sans text-sm text-background/60 max-w-xs">
            Crafted for those who move through the world with intention. Brutally minimal luxury editorial fashion.
          </p>
        </div>
        
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/50 mb-6">Shop</h4>
          <ul className="space-y-4 font-sans text-sm">
            <li><Link href="/shop?category=clothes" className="hover:opacity-60 transition-opacity">Clothes</Link></li>
            <li><Link href="/shop?category=handbags" className="hover:opacity-60 transition-opacity">Handbags</Link></li>
            <li><Link href="/shop?category=accessories" className="hover:opacity-60 transition-opacity">Accessories</Link></li>
            <li><Link href="/lookbook" className="hover:opacity-60 transition-opacity">Lookbook</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/50 mb-6">Support</h4>
          <ul className="space-y-4 font-sans text-sm">
            <li><Link href="/contact" className="hover:opacity-60 transition-opacity">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:opacity-60 transition-opacity">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:opacity-60 transition-opacity">Shipping & Returns</Link></li>
            <li><Link href="/terms" className="hover:opacity-60 transition-opacity">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/50 mb-6">Newsletter</h4>
          <p className="font-sans text-sm text-background/60 mb-4">
            No spam. Just new arrivals and exclusive offers.
          </p>
          <form className="flex border-b border-background/20 focus-within:border-background transition-colors pb-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-transparent border-none outline-none w-full font-sans text-sm placeholder:text-background/40"
            />
            <button type="submit" className="font-mono text-[10px] uppercase tracking-widest hover:opacity-60 transition-opacity">
              Join
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-background/40">
          © {new Date().getFullYear()} Maison. All rights reserved.
        </p>
        <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest text-background/40">
          <a href="#" className="hover:text-background transition-colors">Instagram</a>
          <a href="#" className="hover:text-background transition-colors">Pinterest</a>
          <a href="#" className="hover:text-background transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}

