"use client"
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const isCartOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  
  // Prevent hydration errors by only rendering cart items on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white z-50 flex flex-col border-l border-site-border"
          >
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em]">Your Bag ({getTotalItems()})</h2>
              <button onClick={closeCart} className="p-2 -mr-2 hover:opacity-50 transition-opacity">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 hide-scrollbar">
              {!items?.length ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag className="w-8 h-8 mb-4 stroke-[1]" />
                  <p className="font-mono text-[11px] uppercase tracking-widest">Your bag is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 aspect-[3/4] bg-secondary overflow-hidden relative">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-sans text-sm">{item.name}</h3>
                          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                            {item.size && `Size: ${item.size}`} {item.color && `Color: ${item.color}`}
                          </p>
                        </div>
                        <button onClick={() => removeItem(item.productId, item.variantId)} className="text-muted-foreground hover:text-foreground">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-sans text-sm">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border/50 bg-background/50 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6 font-sans">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg">{formatPrice(getTotalPrice())}</span>
                </div>
                <Link 
                  href="/checkout" 
                  onClick={closeCart}
                  className="w-full block text-center bg-foreground text-background py-4 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-all hover:shadow-lg shadow-black/10 hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                </Link>
                <p className="text-center font-mono text-[9px] text-muted-foreground mt-4 uppercase tracking-widest">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
