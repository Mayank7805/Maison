"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrderAction(data: any) {
  // This will primarily be handled by Razorpay payment verification, but here is a manual creation option if needed
  const session = await auth();
  if (!session?.user) return { error: "Must be logged in" };

  try {
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber: `MAISON-${Date.now()}`,
        status: "PENDING",
        subtotal: data.subtotal,
        total: data.total,
        discount: data.discount || 0,
        shipping: data.shipping || 0,
        tax: data.tax || 0,
        couponCode: data.couponCode,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          }))
        },
        shippingAddress: {
          create: data.shippingAddress
        }
      }
    });

    revalidatePath("/account/orders");
    return { success: true, orderId: order.id };
  } catch (error) {
    return { error: "Failed to create order" };
  }
}

export async function cancelOrderAction(orderId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Must be logged in" };

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || order.userId !== session.user.id) {
      return { error: "Order not found" };
    }

    if (order.status !== "PENDING") {
      return { error: "Cannot cancel order at this stage" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" }
    });

    revalidatePath(`/account/orders`);
    revalidatePath(`/account/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to cancel order" };
  }
}
