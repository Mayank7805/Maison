import { Router } from "express";
import { db } from "@workspace/db";
import { cartsTable, cartItemsTable, productsTable, categoriesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { optionalAuth, type AuthRequest } from "../lib/auth.js";

const router = Router();

async function getCartWithItems(cartId: string) {
  const items = await db
    .select({ item: cartItemsTable, product: productsTable, category: categoriesTable })
    .from(cartItemsTable)
    .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(cartItemsTable.cartId, cartId));

  const cartItems = items.map(({ item, product, category }) => ({
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    product: product ? {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : undefined,
      images: product.images,
      categoryName: category?.name,
      categorySlug: category?.slug,
      stock: product.stock,
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
    } : undefined,
  }));

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { id: cartId, items: cartItems, subtotal, total: subtotal, itemCount };
}

router.get("/", optionalAuth as any, async (req: AuthRequest, res) => {
  try {
    const guestId = req.query["guestId"] as string;
    let cart;
    if (req.user) {
      [cart] = await db.select().from(cartsTable).where(eq(cartsTable.userId, req.user.id));
      if (!cart) {
        [cart] = await db.insert(cartsTable).values({ userId: req.user.id }).returning();
      }
    } else if (guestId) {
      [cart] = await db.select().from(cartsTable).where(eq(cartsTable.guestId, guestId));
      if (!cart) {
        [cart] = await db.insert(cartsTable).values({ guestId }).returning();
      }
    } else {
      return res.json({ id: "empty", items: [], subtotal: 0, total: 0, itemCount: 0 });
    }
    res.json(await getCartWithItems(cart.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

router.post("/", optionalAuth as any, async (req: AuthRequest, res) => {
  try {
    const { productId, variantId, quantity = 1, guestId, size, color } = req.body;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    let cart;
    if (req.user) {
      [cart] = await db.select().from(cartsTable).where(eq(cartsTable.userId, req.user.id));
      if (!cart) {
        [cart] = await db.insert(cartsTable).values({ userId: req.user.id }).returning();
      }
    } else if (guestId) {
      [cart] = await db.select().from(cartsTable).where(eq(cartsTable.guestId, guestId));
      if (!cart) {
        [cart] = await db.insert(cartsTable).values({ guestId }).returning();
      }
    } else {
      const [newCart] = await db.insert(cartsTable).values({}).returning();
      cart = newCart;
    }

    const conditions: any[] = [eq(cartItemsTable.cartId, cart.id), eq(cartItemsTable.productId, productId)];
    if (variantId) conditions.push(eq(cartItemsTable.variantId, variantId));

    const [existing] = await db.select().from(cartItemsTable).where(and(...conditions));
    if (existing) {
      await db.update(cartItemsTable)
        .set({ quantity: existing.quantity + quantity })
        .where(eq(cartItemsTable.id, existing.id));
    } else {
      await db.insert(cartItemsTable).values({ cartId: cart.id, productId, variantId, quantity, size, color });
    }

    res.json(await getCartWithItems(cart.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

router.put("/:itemId", optionalAuth as any, async (req: AuthRequest, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, guestId } = req.body;
    const [item] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, itemId));
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (quantity <= 0) {
      await db.delete(cartItemsTable).where(eq(cartItemsTable.id, itemId));
    } else {
      await db.update(cartItemsTable).set({ quantity }).where(eq(cartItemsTable.id, itemId));
    }
    res.json(await getCartWithItems(item.cartId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

router.delete("/:itemId", optionalAuth as any, async (req: AuthRequest, res) => {
  try {
    const { itemId } = req.params;
    const [item] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, itemId));
    if (!item) return res.status(404).json({ message: "Item not found" });
    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, itemId));
    res.json(await getCartWithItems(item.cartId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove from cart" });
  }
});

export default router;
