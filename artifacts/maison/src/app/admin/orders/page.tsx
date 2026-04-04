import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminOrdersPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/")

  const orders = await prisma.order.findMany({
    include: { 
      items: true,
      user: true,
      shippingAddress: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-cormorant text-4xl font-light">
          Orders
        </h1>
        <p className="font-mono text-xs tracking-widest 
                      text-muted mt-1">
          {orders.length} TOTAL ORDERS
        </p>
      </div>

      <div className="bg-white border border-site-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-site-border">
                {["ORDER #", "CUSTOMER", "DATE", 
                  "ITEMS", "TOTAL", "STATUS", "ACTION"].map(h => (
                  <th 
                    key={h}
                    className="font-mono text-xs tracking-widest 
                               text-muted text-left p-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr 
                  key={order.id}
                  className="border-b border-site-border 
                             hover:bg-cream transition-colors"
                >
                  <td className="p-4 font-mono text-xs tracking-widest">
                    {order.orderNumber}
                  </td>
                  <td className="p-4">
                    <p className="font-dm-sans text-sm">
                      {order.user?.name || order.guestEmail || "Guest"}
                    </p>
                    <p className="font-mono text-xs text-muted">
                      {order.user?.email || order.guestEmail}
                    </p>
                  </td>
                  <td className="p-4 font-mono text-xs text-muted">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-4 font-mono text-xs">
                    {order.items.length}
                  </td>
                  <td className="p-4 font-mono text-xs">
                    ₹{order.total?.toLocaleString("en-IN")}
                  </td>
                  <td className="p-4">
                    <span className={`
                      font-mono text-xs tracking-widest px-2 py-1
                      ${order.status === "DELIVERED" 
                        ? "text-green-600 bg-green-50"
                        : order.status === "CANCELLED"
                        ? "text-red-600 bg-red-50"
                        : order.status === "CONFIRMED"
                        ? "text-blue-600 bg-blue-50"
                        : "text-amber-600 bg-amber-50"
                      }
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-xs tracking-widest 
                                 text-gold hover:text-ink 
                                 transition-colors uppercase"
                    >
                      VIEW →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-16">
              <p className="font-mono text-xs tracking-widest text-muted">
                NO ORDERS YET
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
