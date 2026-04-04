"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToCartAction(productId: string, variantId?: string, quantity: number = 1) {
  const session = await auth();
  if (!session?.user) return { error: "Must be logged in to sync cart" };

  let cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: session.user.id },
    });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, variantId, quantity },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCartAction(cartItemId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Must be logged in" };

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartQuantityAction(cartItemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user) return { error: "Must be logged in" };

  if (quantity < 1) {
    return removeFromCartAction(cartItemId);
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  revalidatePath("/cart");
  return { success: true };
}

export async function clearCartAction() {
  const session = await auth();
  if (!session?.user) return { error: "Must be logged in" };

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}
