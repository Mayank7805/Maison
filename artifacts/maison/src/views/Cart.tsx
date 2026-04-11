"use client";
import { AppLayout } from "@/components/layout/AppLayout";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, X } from "lucide-react";

export default function Cart() {
  const items = useCartStore(state => state.items);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const getTotalPrice = useCartStore(state => state.getTotalPrice);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return removeItem(itemId);
    updateQuantity(itemId, quantity);
  };

  return (
    <AppLayout>
      <div className="max-w-[1000px] mx-auto w-full pt-32 pb-24 px-6 md:px-12">
        <h1 className="font-display text-4xl mb-12">Shopping Bag</h1>

        {!items?.length ? (
          <div className="text-center py-24 border border-dashed border-border/50">
            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-8">Your bag is empty.</p>
            <Link href="/shop" className="inline-block bg-foreground text-background py-4 px-8 font-mono text-[11px] uppercase tracking-widest hover:bg-primary transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex-1 space-y-8">
              {items.map(item => (
                <div key={item.id} className="flex gap-6 pb-8 border-b border-border/50">
                  <div className="w-32 aspect-[3/4] bg-secondary">
                    {item.image && <img src={item.image} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <h3 className="font-sans text-lg">{item.name}</h3>
                      <button onClick={() => removeItem(item.productId, item.variantId)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground uppercase mt-2">Size: {item.size || 'M'}</p>
                    <p className="font-sans mt-2">{formatPrice(item.price)}</p>
                    
                    <div className="mt-auto flex items-center border border-border w-max">
                      <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} className="p-3 hover:bg-muted transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs w-8 text-center">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} className="p-3 hover:bg-muted transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-[350px] bg-secondary p-8 h-max">
              <h2 className="font-mono text-[11px] uppercase tracking-widest mb-6">Order Summary</h2>
              <div className="space-y-4 font-sans text-sm mb-8 border-b border-border/50 pb-8">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(getTotalPrice())}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Calculated at checkout</span></div>
              </div>
              <div className="flex justify-between font-sans text-lg mb-8">
                <span>Total</span><span>{formatPrice(getTotalPrice())}</span>
              </div>
              <Link href="/checkout" className="block text-center w-full bg-ink text-cream border-2 border-ink py-5 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-transparent hover:text-ink transition-all duration-300">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
