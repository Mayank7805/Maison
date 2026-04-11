"use client";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";

export default function Shop({ initialProducts = [], category }: { initialProducts?: any[], category?: string }) {
  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-20 pb-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-site-border pb-8">
          <div>
            <h1 className="font-display text-5xl mb-2 capitalize">
              {category ? category : "All Products"}
            </h1>
            <p className="font-mono text-xs text-muted uppercase tracking-widest">
              {initialProducts.length} Items
            </p>
          </div>
        </div>

        <MobileFilterDrawer />

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          {/* Sidebar */}
          <div className="hidden md:block w-64 shrink-0">
            <FilterSidebar />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {!initialProducts.length ? (
              <div className="py-32 text-center text-muted font-mono uppercase tracking-widest text-sm">
                No products found matching your filters.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                {initialProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
