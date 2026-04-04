"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleWishlistAction(productId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to save to wishlist." };
  }

  const userId = session.user.id;

  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      wishlistId_productId: { wishlistId: wishlist.id, productId },
    },
  });

  if (existingItem) {
    await prisma.wishlistItem.delete({
      where: { id: existingItem.id },
    });
  } else {
    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });
  }

  revalidatePath("/account/wishlist");
  revalidatePath("/shop");
  return { success: true };
}
