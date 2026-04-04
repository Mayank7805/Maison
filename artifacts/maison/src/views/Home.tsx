import { AppLayout } from "@/components/layout/AppLayout";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isArchived: false, isFeatured: true },
    include: { category: true },
    take: 8
  });

  return (
    <AppLayout>
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* landing page hero scenic fashion desert */}
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"/>
        </div>
        
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="font-cormorant font-light text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-center md:text-left leading-none tracking-tight mb-8">
            New Collection<br/>
            <em className="text-gold italic">— SS 2025</em>
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-8">
            <Link 
              href="/shop" 
              className="w-full sm:w-auto px-10 py-4 border border-white text-white font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors duration-300 text-center"
            >
              Shop Collection
            </Link>
            <Link 
              href="/lookbook" 
              className="hidden sm:block px-10 py-4 border border-white/50 text-white/80 font-mono text-[11px] uppercase tracking-[0.2em] hover:border-white hover:text-white transition-colors duration-300 text-center"
            >
              View Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* Category Trio */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {[
            { name: "Clothes", img: "https://images.unsplash.com/photo-1434389670869-c419c8d5fe6d?w=800&q=80", link: "/shop?category=clothes" },
            { name: "Handbags", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80", link: "/shop?category=handbags" },
            { name: "Accessories", img: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80", link: "/shop?category=accessories" },
          ].map((cat) => (
            <Link key={cat.name} href={cat.link} className="group block relative overflow-hidden aspect-[4/5]">
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute bottom-8 left-8">
                <span className="font-mono text-xs text-white uppercase tracking-[0.2em] relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Curated Edit</h2>
          <Link href="/shop" className="font-mono text-[11px] uppercase tracking-[0.2em] hover:text-primary transition-colors border-b border-foreground pb-1">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
             <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            // Skeletons if no data
            Array.from({length: 4}).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted mb-4" />
                <div className="h-4 bg-muted w-2/3 mb-2" />
                <div className="h-4 bg-muted w-1/3" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Brand Story Strip */}
      <section className="bg-secondary py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <p className="font-display text-3xl md:text-5xl leading-tight">
            Crafted for those who move through the world with intention.
          </p>
          <Link href="/about" className="inline-block font-mono text-[11px] uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
            Our Story
          </Link>
        </div>
      </section>

      {/* Lookbook Preview */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-8 max-w-md mx-auto md:mx-0 text-center md:text-left">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Editorial</h2>
            <h3 className="font-display text-4xl md:text-6xl leading-none">The Space Between</h3>
            <p className="font-sans text-muted-foreground">
              A study in contrasts. Fluid silks meet structured tailoring in our latest editorial exploration of urban movement.
            </p>
            <Link 
              href="/lookbook" 
              className="inline-block px-8 py-4 bg-foreground text-background font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-primary transition-colors"
            >
              View Lookbook
            </Link>
          </div>
          <div className="order-1 md:order-2 aspect-[4/5] bg-muted relative">
            {/* lookbook preview minimal model */}
            <img 
              src="https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1000&q=80" 
              alt="Lookbook Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
