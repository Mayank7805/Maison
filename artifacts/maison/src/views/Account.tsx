"use client";
import { formatPrice } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Account() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetch("/api/orders").then(res => res.json()).then(data => setOrders(data || []));
    }
  }, [user]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div className="h-screen animate-pulse bg-background" />;

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
      <div className="max-w-[1200px] mx-auto w-full pt-32 pb-24 px-6 md:px-12">
        <header className="flex justify-between items-end border-b border-site-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-4xl mb-2">My Account</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Welcome, {user.name || user.email}</p>
          </div>
          <div className="flex gap-4">
            {user.role === 'ADMIN' && (
              <button onClick={() => router.push("/admin")} className="font-mono uppercase border border-ink px-4 py-2 text-xs tracking-widest hover:bg-ink hover:text-white transition-colors">
                Admin Panel
              </button>
            )}
            <button onClick={handleLogout} className="font-mono uppercase border border-site-border px-4 py-2 text-xs tracking-widest text-muted hover:border-ink hover:text-ink transition-colors">
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 border-r border-site-border">
            <nav className="flex flex-col gap-6 font-mono text-[11px] uppercase tracking-[0.15em] pr-6">
              <Link href="/account/orders" className="text-foreground border-l-2 border-ink pl-4 block">Order History</Link>
              <Link href="/account/wishlist" className="text-muted border-l-2 border-transparent hover:border-gold hover:text-foreground pl-[18px] transition-colors block">Wishlist</Link>
              <Link href="/account/profile" className="text-muted border-l-2 border-transparent hover:border-gold hover:text-foreground pl-[18px] transition-colors block">Profile Details</Link>
              <Link href="/account/addresses" className="text-muted border-l-2 border-transparent hover:border-gold hover:text-foreground pl-[18px] transition-colors block">Address Book</Link>
            </nav>
          </div>

          {/* Content Area - Orders */}
          <div className="lg:col-span-3 bg-white border border-site-border p-8">
            <h2 className="font-display text-2xl mb-8">Order History</h2>
            
            {!orders?.length ? (
              <div className="bg-cream-2 border border-site-border rounded p-16 text-center">
                <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">No past orders.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map(order => (
                  <div key={order.id} className="border border-border p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-border/50 pb-6">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Order #</p>
                        <p className="font-sans text-sm">{order.id.slice(0, 8)}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Date</p>
                        <p className="font-sans text-sm">{new Date(order.createdAt || '').toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Total</p>
                        <p className="font-sans text-sm">{formatPrice(order.total)}</p>
                      </div>
                      <div>
                        <span className="inline-block bg-secondary text-foreground font-mono text-[10px] uppercase tracking-widest px-3 py-1">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-muted">
                             {item.productImage && <img src={item.productImage} className="w-full h-full object-cover" alt="" />}
                          </div>
                          <div className="flex-1 font-sans text-sm">
                            <p>{item.productName}</p>
                            <p className="text-muted-foreground text-xs mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="font-sans text-sm">{formatPrice(item.price)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
