import { NextResponse } from "next/server"
import crypto from "crypto"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const random = Math.floor(Math.random() * 9000 + 1000)
  return `MAISON-${year}${month}${day}-${random}`
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      shippingAddress,
      amount,
      couponCode,
      discount,
    } = body

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )
    const shipping = subtotal > 5000 ? 0 : 199
    const tax = Math.round(subtotal * 0.18)
    const total = subtotal + shipping + tax - (discount || 0)

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.user?.id || null,
        guestEmail: !session?.user ? shippingAddress.email : null,
        status: "CONFIRMED",
        subtotal,
        shipping,
        tax,
        discount: discount || 0,
        total,
        couponCode: couponCode || null,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        items: {
          create: cartItems.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            name: item.name,
            image: item.image || "",
            size: item.size || null,
            color: item.color || null,
            quantity: item.quantity,
            price: item.price,
          }))
        },
        shippingAddress: {
          create: {
            fullName: shippingAddress.fullName,
            phone: shippingAddress.phone,
            line1: shippingAddress.line1,
            line2: shippingAddress.line2 || "",
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode,
            country: shippingAddress.country || "India",
          }
        }
      },
      include: { items: true }
    })

    // Update stock for each product
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }

    // Mark coupon as used if applied
    if (couponCode) {
      await prisma.coupon.update({
        where: { code: couponCode },
        data: { usedCount: { increment: 1 } }
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    })
  } catch (error: any) {
    console.error("Payment verify error:", error)
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    )
  }
}
