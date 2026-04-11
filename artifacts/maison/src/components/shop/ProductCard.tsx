"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";

interface ProductCardProps {
  product: any; // Using any to bypass strict Orval typing issues if mismatch, in real app import { Product }
}

export function ProductCard({ product }: ProductCardProps) {
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block cursor-pointer">
      <div className="relative aspect-[3/4] bg-secondary mb-4 overflow-hidden">
        {product.images?.[0] && (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        )}
        {product.images?.[1] && (
          <img 
            src={product.images[1]} 
            alt={product.name} 
            className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-4 right-4 p-2 bg-background/0 transition-all duration-300 hover:scale-110 ${
            isInWishlist 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 text-foreground"
          }`}
        >
          <Heart 
            size={18} 
            fill={isInWishlist ? "#C9A96E" : "none"}
            stroke={isInWishlist ? "#C9A96E" : "currentColor"}
          />
        </button>

        {/* Quick Add Overlay (Mobile hidden, Desktop hover) */}
        <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 hidden md:block bg-gradient-to-t from-black/50 to-transparent">
          <div className="font-mono text-[10px] uppercase tracking-widest text-white text-center">
            View Details
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-start gap-2 md:gap-4 p-2 md:p-4">
        <div>
          <h3 className="font-sans text-sm md:text-base font-medium leading-tight">{product.name}</h3>
          <p className="font-mono hidden md:block text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
            {product.categoryName || 'Clothing'}
          </p>
        </div>
        <span className="font-sans text-xs md:text-sm whitespace-nowrap">{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}
