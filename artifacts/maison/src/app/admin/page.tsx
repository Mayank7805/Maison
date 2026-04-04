import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/")

  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.product.count({ where: { isArchived: false } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 }, isArchived: false },
      take: 5,
    }),
  ])

  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { not: "CANCELLED" } },
  })

  const stats = [
    { 
      label: "TOTAL REVENUE", 
      value: `₹${(totalRevenue._sum.total || 0).toLocaleString("en-IN")}` 
    },
    { label: "TOTAL ORDERS", value: totalOrders },
    { label: "TOTAL PRODUCTS", value: totalProducts },
    { label: "TOTAL CUSTOMERS", value: totalCustomers },
  ]

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-cormorant text-4xl font-light">
          Dashboard
        </h1>
        <p className="font-mono text-xs tracking-widest 
                      text-muted mt-1">
          WELCOME BACK, {session.user.name?.toUpperCase()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div 
            key={stat.label}
            className="bg-white border border-site-border p-6"
          >
            <p className="font-mono text-xs tracking-widest 
                          text-muted mb-3">
              {stat.label}
            </p>
            <p className="font-cormorant text-3xl font-light">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        
        {/* Recent Orders */}
        <div className="bg-white border border-site-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-xs tracking-widest uppercase">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="font-mono text-xs tracking-widest 
                         text-gold hover:text-ink transition-colors"
            >
              VIEW ALL →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="font-mono text-xs text-muted text-center py-8">
              NO ORDERS YET
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between 
                             py-3 border-b border-site-border 
                             last:border-0 hover:text-gold 
                             transition-colors"
                >
                  <div>
                    <p className="font-mono text-xs tracking-widest">
                      {order.orderNumber}
                    </p>
                    <p className="font-mono text-xs text-muted mt-1">
                      {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`
                      font-mono text-xs tracking-widest px-2 py-1
                      ${order.status === "DELIVERED" 
                        ? "text-green-600 bg-green-50" 
                        : order.status === "CANCELLED"
                        ? "text-red-600 bg-red-50"
                        : "text-gold bg-amber-50"
                      }
                    `}>
                      {order.status}
                    </span>
                    <p className="font-mono text-xs mt-1">
                      ₹{order.total?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-site-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-xs tracking-widest uppercase">
              Low Stock Alert
            </h2>
            <Link
              href="/admin/products"
              className="font-mono text-xs tracking-widest 
                         text-gold hover:text-ink transition-colors"
            >
              VIEW ALL →
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="font-mono text-xs text-muted text-center py-8">
              ALL PRODUCTS WELL STOCKED
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="flex items-center justify-between 
                             py-3 border-b border-site-border 
                             last:border-0 hover:text-gold 
                             transition-colors"
                >
                  <p className="font-mono text-xs tracking-widest">
                    {product.name}
                  </p>
                  <span className="font-mono text-xs 
                                   text-red-600 bg-red-50 
                                   px-2 py-1">
                    {product.stock} LEFT
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
