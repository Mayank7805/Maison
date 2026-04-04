import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    orderId?: string
    orderNumber?: string 
  }>
}) {
  const params = await searchParams
  
  return (
    <div className="min-h-screen bg-cream flex items-center 
                    justify-center px-4">
      <div className="max-w-lg w-full text-center">
        
        <div className="w-20 h-20 bg-green-50 border 
                        border-green-200 rounded-full flex 
                        items-center justify-center mx-auto mb-8">
          <CheckCircle size={40} className="text-green-500" />
        </div>

        <h1 className="font-cormorant text-4xl font-light mb-4">
          Order Confirmed
        </h1>
        
        {params.orderNumber && (
          <p className="font-mono text-xs tracking-widest 
                        text-gold uppercase mb-2">
            {params.orderNumber}
          </p>
        )}
        
        <p className="text-muted text-sm font-light mb-12 
                      leading-relaxed">
          Thank you for your purchase. Your order has been 
          confirmed and will be processed shortly.
        </p>

        <div className="bg-white border border-site-border 
                        p-6 mb-8 text-left">
          <p className="font-mono text-xs tracking-widest 
                        text-muted uppercase mb-4">
            What happens next?
          </p>
          <div className="space-y-3">
            {[
              "Order confirmation sent to your email",
              "Processing begins within 24 hours",
              "Shipping details sent once dispatched",
              "Delivery within 5-7 business days",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-ink text-white 
                                rounded-full flex items-center 
                                justify-center font-mono text-xs 
                                flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-muted">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/account/orders"
            className="font-mono text-xs tracking-widest 
                       uppercase border border-ink px-8 py-4
                       hover:bg-ink hover:text-white 
                       transition-colors"
          >
            VIEW ORDER
          </Link>
          <Link
            href="/shop"
            className="font-mono text-xs tracking-widest 
                       uppercase border border-site-border 
                       px-8 py-4 text-muted
                       hover:border-ink hover:text-ink 
                       transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  )
}
