import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  
  const resolvedParams = await params
  
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id, userId: session.user.id },
    include: { items: true },
  })

  if (!order) return <div className="min-h-screen bg-cream flex justify-center items-center font-mono">Order Not Found</div>

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/account/orders" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted hover:text-ink transition-colors mb-12">
          <ChevronLeft className="w-3 h-3" /> Back to Orders
        </Link>
        
        <div className="bg-white border border-site-border p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-site-border pb-8 mb-8 gap-6">
            <div>
              <h1 className="font-cormorant text-4xl font-light mb-2">Order #{order.orderNumber}</h1>
              <p className="font-mono text-xs tracking-widest text-muted uppercase">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
               <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 border border-ink bg-ink text-white">
                 {order.status}
               </span>
            </div>
          </div>
          
          <div className="space-y-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-6 items-center">
                <div className="w-16 h-20 bg-cream-2 border border-site-border">
                  {item.productImage && <img src={item.productImage} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-sans text-sm font-medium">{item.productName}</h3>
                  <p className="font-mono text-[10px] text-muted uppercase mt-1">QTY: {item.quantity}</p>
                </div>
                <div className="font-sans text-sm">
                  ₹{item.price?.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-site-border flex justify-between items-center">
            <span className="font-mono text-xs tracking-widest uppercase text-muted">Total Amount</span>
            <span className="font-cormorant text-2xl font-light">₹{order.total?.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
