"use client";
import { AppLayout } from "@/components/layout/AppLayout";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Plus } from "lucide-react";

export default function Admin({ initialProducts, initialStats }: { initialProducts?: any[], initialStats?: any }) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [stats, setStats] = useState<any>(initialStats || null);
  const [products, setProducts] = useState<any>(initialProducts ? { products: initialProducts } : { products: [] });
  const [statsLoading, setStatsLoading] = useState(!initialStats);

  useEffect(() => {
    if (user?.role === 'ADMIN' && !initialStats) {
      fetch("/api/admin/stats").then(res => res.json()).then(data => { setStats(data); setStatsLoading(false); });
      fetch("/api/products").then(res => res.json()).then(data => setProducts({ products: data }));
    }
  }, [user, initialStats]);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && user?.role !== 'ADMIN')) {
      router.push("/");
    }
  }, [user, status, router]);

  if (status === "loading") return <AppLayout><div className="h-screen animate-pulse bg-background" /></AppLayout>;

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full pt-32 pb-24 px-6 md:px-12">
        <header className="flex justify-between items-end mb-16 border-b border-border/50 pb-8">
          <div>
            <h1 className="font-display text-4xl mb-2">Dashboard</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Admin Overview</p>
          </div>
          <button className="flex items-center gap-2 bg-foreground text-background py-3 px-6 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-colors">
            <Plus className="w-3 h-3" /> New Product
          </button>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Total Revenue", value: formatPrice(stats?.totalRevenue || 0) },
            { label: "Orders Today", value: stats?.ordersToday || 0 },
            { label: "Total Orders", value: stats?.totalOrders || 0 },
            { label: "New Customers", value: stats?.newCustomers || 0 },
          ].map((kpi, i) => (
            <div key={i} className="border border-border p-6 bg-secondary/30">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">{kpi.label}</p>
              <p className="font-display text-3xl">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Chart */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Revenue Overview</h2>
            <div className="h-[400px] border border-border p-6 pt-10">
              {statsLoading ? (
                <div className="w-full h-full bg-muted/50 animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.revenueByDay || []}>
                    <XAxis dataKey="date" stroke="#A0A0A0" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#A0A0A0" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0D0D0D', color: '#fff', border: 'none', borderRadius: '0px', fontSize: '12px', fontFamily: 'Space Mono' }}
                      itemStyle={{ color: '#C9A96E' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#0D0D0D" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#C9A96E' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Products */}
          <div className="space-y-6">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Recent Products</h2>
            <div className="border border-border divide-y divide-border/50">
              {products?.products.map((product: any) => (
                <div key={product.id} className="p-4 flex gap-4 items-center hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="w-10 h-14 bg-muted overflow-hidden">
                    {product.images?.[0] && <img src={product.images[0]} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm truncate">{product.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-1 uppercase">Stock: {product.stock}</p>
                  </div>
                  <div className="font-sans text-sm text-right">
                    {formatPrice(product.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
