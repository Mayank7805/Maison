"use client";
import { AppLayout } from "@/components/layout/AppLayout";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SizeSelector } from "@/components/product/SizeSelector";
import { ProductCard } from "@/components/shop/ProductCard";

export default function ProductDetail({ initialProduct, slug, relatedProducts = [] }: { initialProduct?: any, slug?: string, relatedProducts?: any[] }) {
  const [product, setProduct] = useState<any>(initialProduct || null);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [isAdding, setIsAdding] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);

  useEffect(() => {
    if (initialProduct) return;
    fetch(`/api/products?q=${slug}`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.slug === slug);
        setProduct(found || null);
        setIsLoading(false);
      });
  }, [slug, initialProduct]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    // Simulate network delay for UX
    setTimeout(() => {
      addItem({
        id: Math.random().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        size: "M", // Fallback size for now since SizeSelector maintains internal state
        quantity: 1,
      });
      setIsAdding(false);
      openCart();
    }, 500);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse h-screen pt-32 px-12 flex gap-12">
          <div className="w-1/2 bg-muted h-[80vh]" />
          <div className="w-1/2 space-y-8">
            <div className="h-12 bg-muted w-3/4" />
            <div className="h-6 bg-muted w-1/4" />
            <div className="h-32 bg-muted w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!product) return null;

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full pt-24 md:pt-32 pb-24 px-6 md:px-12 flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Gallery */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
          {product.images?.map((img: string, i: number) => (
            <div 
              key={i} 
              className={`bg-secondary overflow-hidden cursor-zoom-in relative ${i === 0 ? 'col-span-2 aspect-[3/4]' : 'col-span-1 aspect-square'}`}
            >
              <img 
                src={img} 
                alt={`${product.name} ${i}`} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
              />
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-8">
            <Link href="/shop" className="hover:text-foreground">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            {product.categoryName && (
              <>
                <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-foreground">
                  {product.categoryName}
                </Link>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </nav>

          <h1 className="font-display text-4xl md:text-5xl mb-4">{product.name}</h1>
          <p className="font-sans text-xl mb-8">{formatPrice(product.price)}</p>

          <div className="mb-8">
            <SizeSelector variants={product.variants || []} />
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-foreground text-background py-5 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300 disabled:opacity-50 hover:shadow-lg shadow-black/10 hover:-translate-y-0.5"
          >
            {isAdding ? "Adding..." : "Add to Bag"}
          </button>

          <div className="mt-16 pt-16 border-t border-border/50">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Description</h3>
            <p className="font-sans text-sm leading-relaxed text-foreground/80">
              {product.description || "A masterclass in modern minimalism. This piece is crafted with meticulous attention to detail, designed to endure beyond seasonal trends. Features premium materials and expert construction."}
            </p>
            
            <div className="mt-8 space-y-4 font-sans text-sm text-foreground/80">
              <div className="flex justify-between py-4 border-b border-border/50">
                <span className="font-mono text-[10px] uppercase tracking-widest">Materials</span>
                <span>100% Premium Fabric</span>
              </div>
              <div className="flex justify-between py-4 border-b border-border/50">
                <span className="font-mono text-[10px] uppercase tracking-widest">Care</span>
                <span>Dry clean only</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts?.length > 0 && (
        <section className="max-w-[1400px] mx-auto w-full px-6 md:px-12 mt-24 border-t border-site-border pt-16 mb-24">
          <h2 className="font-cormorant text-3xl font-light mb-12 text-center text-ink">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </AppLayout>
  );
}
