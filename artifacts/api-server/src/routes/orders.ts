import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, cartItemsTable, cartsTable, productsTable, couponsTable } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../lib/auth.js";

const router = Router();

async function getOrderWithItems(orderId: string) {
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!order) return null;
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    total: parseFloat(order.total),
    subtotal: parseFloat(order.subtotal),
    tax: parseFloat(order.tax),
    shipping: parseFloat(order.shipping),
    stripePaymentId: order.stripePaymentId,
    createdAt: order.createdAt,
    shippingAddress: order.shippingLine1 ? {
      id: order.shippingAddressId || "",
      fullName: order.shippingFullName || "",
      line1: order.shippingLine1 || "",
      line2: order.shippingLine2 || undefined,
      city: order.shippingCity || "",
      state: order.shippingState || undefined,
      zip: order.shippingZip || "",
      country: order.shippingCountry || "US",
      isDefault: false,
    } : undefined,
    items: items.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      quantity: item.quantity,
      price: parseFloat(item.price),
      size: item.size,
      color: item.color,
    })),
  };
}

router.get("/", authMiddleware as any, async (req: AuthRequest, res) => {
  try {
    const orders = await db.select().from(ordersTable)
      .where(eq(ordersTable.userId, req.user!.id))
      .orderBy(desc(ordersTable.createdAt));
    const result = await Promise.all(orders.map(o => getOrderWithItems(o.id)));
    res.json(result.filter(Boolean));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/:id", authMiddleware as any, async (req: AuthRequest, res) => {
  try {
    const order = await getOrderWithItems(req.params["id"]);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId !== req.user!.id && req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { cartId, shippingAddress, stripePaymentId, couponCode, guestId, guestEmail } = req.body;
    const token = req.cookies?.["maison_token"] || req.headers.authorization?.replace("Bearer ", "");
    let userId: string | undefined;
    if (token) {
      const { verifyToken } = await import("../lib/auth.js");
      const payload = verifyToken(token);
      if (payload) userId = payload.userId;
    }

    let items: any[] = [];
    let cartRecord: any;
    if (cartId) {
      [cartRecord] = await db.select().from(cartsTable).where(eq(cartsTable.id, cartId));
    } else if (userId) {
      [cartRecord] = await db.select().from(cartsTable).where(eq(cartsTable.userId, userId));
    } else if (guestId) {
      [cartRecord] = await db.select().from(cartsTable).where(eq(cartsTable.guestId, guestId));
    }

    if (cartRecord) {
      const cartItems = await db
        .select({ item: cartItemsTable, product: productsTable })
        .from(cartItemsTable)
        .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
        .where(eq(cartItemsTable.cartId, cartRecord.id));
      items = cartItems.map(({ item, product }) => ({
        productId: item.productId,
        productName: product?.name || "",
        productImage: product?.images?.[0] || null,
        quantity: item.quantity,
        price: product ? parseFloat(product.price) : 0,
        size: item.size,
        color: item.color,
      }));
    }

    if (items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;

    if (couponCode) {
      const [coupon] = await db.select().from(couponsTable).where(eq(couponsTable.code, couponCode.toUpperCase()));
      if (coupon && coupon.isActive === "true") {
        if (coupon.type === "PERCENT") {
          discount = subtotal * (parseFloat(coupon.value) / 100);
        } else {
          discount = parseFloat(coupon.value);
        }
        discount = Math.min(discount, subtotal);
      }
    }

    const tax = (subtotal - discount) * 0.08;
    const shipping = subtotal > 200 ? 0 : 15;
    const total = subtotal - discount + tax + shipping;

    const [order] = await db.insert(ordersTable).values({
      userId,
      guestEmail,
      status: "PENDING",
      total: total.toFixed(2),
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      discount: discount.toFixed(2),
      stripePaymentId,
      couponCode,
      shippingFullName: shippingAddress?.fullName,
      shippingLine1: shippingAddress?.line1,
      shippingLine2: shippingAddress?.line2,
      shippingCity: shippingAddress?.city,
      shippingState: shippingAddress?.state,
      shippingZip: shippingAddress?.zip,
      shippingCountry: shippingAddress?.country || "US",
    }).returning();

    await db.insert(orderItemsTable).values(items.map(item => ({ ...item, orderId: order.id, price: item.price.toFixed(2) })));

    if (cartRecord) {
      await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cartRecord.id));
    }

    const result = await getOrderWithItems(order.id);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

export default router;
