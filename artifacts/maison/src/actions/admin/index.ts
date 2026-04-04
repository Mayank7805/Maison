"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productSchema, couponSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createProductAction(data: any) {
  await requireAdmin();
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid product data" };

  try {
    await prisma.product.create({
      data: parsed.data,
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create product" };
  }
}

export async function updateProductAction(id: string, data: any) {
  await requireAdmin();
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid product data" };

  try {
    await prisma.product.update({
      where: { id },
      data: parsed.data,
    });
    revalidatePath("/admin/products");
    revalidatePath(`/product/${parsed.data.slug}`);
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update product" };
  }
}

export async function archiveProductAction(id: string) {
  await requireAdmin();
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return { error: "Product not found" };

    await prisma.product.update({
      where: { id },
      data: { isArchived: !product.isArchived },
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    return { error: "Failed to archive product" };
  }
}

export async function updateOrderStatusAction(orderId: string, status: any) {
  await requireAdmin();
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update order status" };
  }
}

export async function createCouponAction(data: any) {
  await requireAdmin();
  const parsed = couponSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid coupon data" };

  try {
    await prisma.coupon.create({
      data: parsed.data,
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create coupon" };
  }
}

export async function deleteCouponAction(id: string) {
  await requireAdmin();
  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete coupon" };
  }
}
