"use client";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { RazorpayButton } from "@/components/checkout/RazorpayButton";

export default function Checkout() {
  const items = useCartStore(state => state.items);
  const getTotalPrice = useCartStore(state => state.getTotalPrice);
  const clearCart = useCartStore(state => state.clearCart);
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "", fullName: "", line1: "", city: "", state: "", pincode: "", country: "India", phone: ""
  });

  if (!items?.length && step === 1) {
    return (
      <AppLayout>
        <div className="pt-32 text-center pb-32">
          <p className="font-mono uppercase tracking-widest text-muted-foreground">Cart is empty</p>
          <Link href="/shop" className="mt-8 inline-block underline underline-offset-4">Return to Shop</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto w-full pt-24 md:pt-32 pb-24 px-6 md:px-12 flex flex-col lg:flex-row gap-16">
        
        {/* Left Column: Flow */}
        <div className="flex-1">
          {/* Progress Indicator */}
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest mb-12">
            <span className={step >= 1 ? "text-foreground" : "text-muted-foreground"}>1. Shipping</span>
            <span className="w-8 h-[1px] bg-border" />
            <span className={step >= 2 ? "text-foreground" : "text-muted-foreground"}>2. Payment</span>
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="font-display text-3xl">Shipping Address</h2>
              <div className="space-y-4 font-sans">
                <input 
                  type="email" placeholder="Email for order confirmation" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors"
                />
                <input 
                  type="text" placeholder="Full Name" 
                  value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors"
                />
                <input 
                  type="text" placeholder="Address Line 1" 
                  value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})}
                  className="w-full border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors"
                />
                <input 
                  type="tel" placeholder="Phone Number" 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors"
                />
                <div className="flex gap-4">
                  <input 
                    type="text" placeholder="City" 
                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-1/3 border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors"
                  />
                  <input 
                    type="text" placeholder="State" 
                    value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}
                    className="w-1/3 border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors"
                  />
                  <input 
                    type="text" placeholder="PIN Code" 
                    value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})}
                    className="w-1/3 border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors"
                  />
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!formData.email || !formData.fullName || !formData.line1 || !formData.phone || !formData.state || !formData.pincode || !formData.city}
                className="w-full bg-foreground text-background py-5 font-mono text-[11px] uppercase tracking-[0.2em] disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-3xl">Payment</h2>
                <button onClick={() => setStep(1)} className="font-mono text-xs underline uppercase tracking-widest text-muted-foreground">Edit Shipping</button>
              </div>
              
              <div className="bg-white border border-site-border p-8">
                <div className="flex items-center gap-3 mb-6 
                                pb-6 border-b border-site-border">
                  <div className="w-8 h-8 bg-ink rounded-full flex 
                                  items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" 
                         fill="none" stroke="white" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-xs tracking-widest uppercase">
                      Secure Payment
                    </p>
                    <p className="font-mono text-xs text-muted">
                      Powered by Razorpay
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {["UPI", "Cards", "Net Banking", 
                    "EMI", "Wallets", "Pay Later"].map((method) => (
                    <div 
                      key={method}
                      className="border border-site-border p-3 
                                 text-center font-mono text-xs 
                                 tracking-widest text-muted"
                    >
                      {method.toUpperCase()}
                    </div>
                  ))}
                </div>

                <RazorpayButton
                  amount={getTotalPrice()}
                  shippingAddress={formData}
                  couponCode={undefined}
                  discount={0}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-[400px] bg-secondary p-8 self-start sticky top-32">
          <h3 className="font-mono text-[11px] uppercase tracking-widest mb-6 border-b border-border/50 pb-4">Order Summary</h3>
          <div className="space-y-4 mb-8">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 items-start">
                <img src={item.image} className="w-16 h-20 object-cover bg-background" alt="" />
                <div className="flex-1 font-sans text-sm">
                  <p>{item.name}</p>
                  <p className="text-muted-foreground text-xs mt-1">Qty: {item.quantity}</p>
                </div>
                <span className="font-sans text-sm">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border/50 pt-4 space-y-2 font-sans text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(getTotalPrice())}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Free</span></div>
            <div className="flex justify-between text-lg text-foreground mt-4 pt-4 border-t border-border/50">
              <span>Total</span><span>{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
