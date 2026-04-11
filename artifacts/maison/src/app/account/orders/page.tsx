import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        <div className="border-b border-site-border pb-8 mb-12">
          <h1 className="font-cormorant text-4xl font-light">
            Order History
          </h1>
          <p className="font-mono text-xs tracking-widest 
                        text-muted mt-2">
            {orders.length} {orders.length === 1 ? "ORDER" : "ORDERS"}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 border 
                          border-site-border bg-white">
            <h2 className="font-cormorant text-2xl font-light mb-4">
              No orders yet
            </h2>
            <p className="font-mono text-xs tracking-widest 
                          text-muted mb-8">
              YOUR ORDER HISTORY WILL APPEAR HERE
            </p>
            <Link
              href="/shop"
              className="font-mono text-xs tracking-widest 
                         uppercase border border-ink px-8 py-3
                         hover:bg-ink hover:text-white 
                         transition-colors"
            >
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block bg-white border border-site-border 
                           p-6 hover:border-ink transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-mono text-xs tracking-widest 
                                  text-muted uppercase mb-1">
                      Order #{order.orderNumber}
                    </p>
                    <p className="font-mono text-xs text-muted">
                      {new Date(order.createdAt).toLocaleDateString(
                        "en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        }
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`
                      font-mono text-xs tracking-widest uppercase 
                      px-3 py-1 border
                      ${order.status === "DELIVERED" 
                        ? "border-green-300 text-green-600 bg-green-50"
                        : order.status === "CANCELLED"
                        ? "border-red-300 text-red-600 bg-red-50"
                        : "border-gold text-gold bg-amber-50"
                      }
                    `}>
                      {order.status}
                    </span>
                    <p className="font-cormorant text-xl font-light mt-2">
                      ₹{order.total?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <p className="font-mono text-xs text-muted">
                  {order.items.length} {order.items.length === 1 
                    ? "item" : "items"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
