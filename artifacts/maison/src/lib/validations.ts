import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  line1: z.string().min(4),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(5),
  country: z.string().default("India"),
});

export const checkoutSchema = z.object({
  address: addressSchema,
  shippingMethod: z.string(),
  couponCode: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().optional(),
  sku: z.string().min(4),
  stock: z.number().int().nonnegative(),
  categoryId: z.string(),
  images: z.array(z.string().url()),
  tags: z.array(z.string()),
  isFeatured: z.boolean().default(false),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(2),
  body: z.string().min(10),
});

export const couponSchema = z.object({
  code: z.string().min(4),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  minOrderAmount: z.number().nonnegative().default(0),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.date().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});
