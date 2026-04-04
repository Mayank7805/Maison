import { Router } from "express";
import { db } from "@workspace/db";
import { wishlistItemsTable, productsTable, categoriesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../lib/auth.js";

const router = Router();

async function getWishlist(userId: string) {
  const items = await db
    .select({ item: wishlistItemsTable, product: productsTable, category: categoriesTable })
    .from(wishlistItemsTable)
    .leftJoin(productsTable, eq(wishlistItemsTable.productId, productsTable.id))
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(wishlistItemsTable.userId, userId));

  return {
    id: userId,
    products: items.map(({ product, category }) => product ? {
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
    } : undefined).filter(Boolean),
  };
}

router.get("/", authMiddleware as any, async (req: AuthRequest, res) => {
  try {
    res.json(await getWishlist(req.user!.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

router.post("/", authMiddleware as any, async (req: AuthRequest, res) => {
  try {
    const { productId } = req.body;
    const [existing] = await db.select().from(wishlistItemsTable)
      .where(and(eq(wishlistItemsTable.userId, req.user!.id), eq(wishlistItemsTable.productId, productId)));
    if (!existing) {
      await db.insert(wishlistItemsTable).values({ userId: req.user!.id, productId });
    }
    res.json(await getWishlist(req.user!.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
});

router.delete("/:productId", authMiddleware as any, async (req: AuthRequest, res) => {
  try {
    await db.delete(wishlistItemsTable)
      .where(and(eq(wishlistItemsTable.userId, req.user!.id), eq(wishlistItemsTable.productId, req.params["productId"])));
    res.json(await getWishlist(req.user!.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
});

export default router;
