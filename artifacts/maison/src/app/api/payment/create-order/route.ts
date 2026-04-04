import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()
    const { amount, cartItems, shippingAddress } = body

    if (!amount || !cartItems || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate stock for each item
    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.name}` },
          { status: 400 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for: ${item.name}` },
          { status: 400 }
        )
      }
    }

    // Amount must be in paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100)

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session?.user?.id || "guest",
        customerEmail: session?.user?.email || 
                       shippingAddress.email || "",
      }
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error("Razorpay create order error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    )
  }
}
