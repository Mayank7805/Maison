"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createReviewAction(productId: string, data: z.infer<typeof reviewSchema>) {
  const session = await auth();
  if (!session?.user) return { error: "You must be logged in" };

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid review data" };
  }

  try {
    const existing = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      }
    });

    if (existing) {
      return { error: "You have already reviewed this product" };
    }

    // Optional: check if user actually purchased the product to set isVerified
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          status: { in: ["DELIVERED", "SHIPPED", "CONFIRMED"] }
        }
      }
    });

    await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating: parsed.data.rating,
        title: parsed.data.title,
        body: parsed.data.body,
        isVerified: !!hasPurchased,
      }
    });

    revalidatePath(`/product/${productId}`);
    return { success: true };
  } catch (error) {
    return { error: "Could not submit review. Please try again." };
  }
}
