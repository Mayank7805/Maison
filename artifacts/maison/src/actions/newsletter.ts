"use server";

import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";

export async function subscribeNewsletterAction(email: string) {
  const parsed = newsletterSchema.safeParse({ email });
  
  if (!parsed.success) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const existing = await prisma.newsletter.findUnique({
      where: { email: parsed.data.email }
    });

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletter.update({
          where: { email: parsed.data.email },
          data: { isActive: true }
        });
        return { success: true, message: "Welcome back!" };
      }
      return { success: true, message: "You are already subscribed." };
    }

    await prisma.newsletter.create({
      data: { email: parsed.data.email }
    });

    return { success: true, message: "Thank you for subscribing." };
  } catch (error) {
    return { error: "Something went wrong. Please try again." };
  }
}
