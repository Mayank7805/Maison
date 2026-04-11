import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db/schema";
import { ilike, or, eq, and } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { q, limit = "10" } = req.query as { q: string; limit: string };
    if (!q) return res.json({ products: [], total: 0, page: 1, totalPages: 0 });

    const products = await db
      .select({ product: productsTable, category: categoriesTable })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(and(
        eq(productsTable.isArchived, false),
        or(ilike(productsTable.name, `%${q}%`), ilike(productsTable.description, `%${q}%`))
      ))
      .limit(Math.min(parseInt(limit) || 10, 50));

    res.json({
      products: products.map(({ product, category }) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.price),
        images: product.images,
        categoryName: category?.name,
        categorySlug: category?.slug,
        stock: product.stock,
        isFeatured: product.isFeatured,
        isArchived: product.isArchived,
      })),
      total: products.length,
      page: 1,
      totalPages: 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
});

export default router;
