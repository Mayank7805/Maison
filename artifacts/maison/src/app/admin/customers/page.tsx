import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function AdminCustomersPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/")

  const customers = await prisma.user.findMany({
    where: { role: "USER" },
    include: { 
      _count: { select: { orders: true } },
      orders: {
        select: { total: true }
      }
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-cormorant text-4xl font-light">
          Customers
        </h1>
        <p className="font-mono text-xs tracking-widest 
                      text-muted mt-1">
          {customers.length} CUSTOMERS
        </p>
      </div>

      <div className="bg-white border border-site-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-site-border">
              {["NAME", "EMAIL", "ORDERS", 
                "TOTAL SPENT", "JOINED"].map(h => (
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
            {customers.map((customer) => {
              const totalSpent = customer.orders.reduce(
                (sum, o) => sum + (o.total || 0), 0
              )
              return (
                <tr 
                  key={customer.id}
                  className="border-b border-site-border 
                             hover:bg-cream transition-colors"
                >
                  <td className="p-4 font-dm-sans text-sm">
                    {customer.name || "—"}
                  </td>
                  <td className="p-4 font-mono text-xs text-muted">
                    {customer.email}
                  </td>
                  <td className="p-4 font-mono text-xs">
                    {customer._count.orders}
                  </td>
                  <td className="p-4 font-mono text-xs">
                    ₹{totalSpent.toLocaleString("en-IN")}
                  </td>
                  <td className="p-4 font-mono text-xs text-muted">
                    {new Date(customer.createdAt)
                      .toLocaleDateString("en-IN")}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div className="text-center py-16">
            <p className="font-mono text-xs tracking-widest text-muted">
              NO CUSTOMERS YET
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
