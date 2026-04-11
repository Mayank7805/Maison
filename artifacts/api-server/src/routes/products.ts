import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable, reviewsTable } from "@workspace/db/schema";
import { eq, and, gte, lte, ilike, or, desc, asc, count, avg } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, page = "1", limit = "20", featured } = req.query as Record<string, string>;
    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 20, 100);
    const offset = (pageNum - 1) * limitNum;

    const conditions: any[] = [eq(productsTable.isArchived, false)];
    if (category) {
      const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, category));
      if (cat) conditions.push(eq(productsTable.categoryId, cat.id));
    }
    if (minPrice) conditions.push(gte(productsTable.price, minPrice));
    if (maxPrice) conditions.push(lte(productsTable.price, maxPrice));
    if (featured === "true") conditions.push(eq(productsTable.isFeatured, true));

    let orderBy: any;
    switch (sort) {
      case "price_asc": orderBy = asc(productsTable.price); break;
      case "price_desc": orderBy = desc(productsTable.price); break;
      case "newest": default: orderBy = desc(productsTable.createdAt); break;
    }

    const [countResult] = await db.select({ count: count() }).from(productsTable).where(and(...conditions));
    const total = countResult?.count ?? 0;

    const products = await db
      .select({
        product: productsTable,
        category: categoriesTable,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limitNum)
      .offset(offset);

    const productIds = products.map(p => p.product.id);
    let reviewData: Record<string, { avg: number; count: number }> = {};
    if (productIds.length > 0) {
      for (const product of products) {
        const [rv] = await db
          .select({ avg: avg(reviewsTable.rating), count: count() })
          .from(reviewsTable)
          .where(eq(reviewsTable.productId, product.product.id));
        if (rv) {
          reviewData[product.product.id] = { avg: parseFloat(rv.avg || "0"), count: Number(rv.count) };
        }
      }
    }

    res.json({
      products: products.map(({ product, category }) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: parseFloat(product.price),
        comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : undefined,
        sku: product.sku,
        stock: product.stock,
        categoryId: product.categoryId,
        categoryName: category?.name,
        categorySlug: category?.slug,
        images: product.images,
        tags: product.tags,
        isFeatured: product.isFeatured,
        isArchived: product.isArchived,
        averageRating: reviewData[product.id]?.avg || 0,
        reviewCount: reviewData[product.id]?.count || 0,
        createdAt: product.createdAt,
      })),
      total: Number(total),
      page: pageNum,
      totalPages: Math.ceil(Number(total) / limitNum),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [result] = await db
      .select({ product: productsTable, category: categoriesTable })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.slug, slug));

    if (!result) return res.status(404).json({ message: "Product not found" });

    const { product, category } = result;

    const [rv] = await db
      .select({ avg: avg(reviewsTable.rating), count: count() })
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, product.id));

    const relatedProducts = await db
      .select({ product: productsTable, category: categoriesTable })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(and(eq(productsTable.categoryId, product.categoryId), eq(productsTable.isArchived, false)))
      .limit(4);

    res.json({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: parseFloat(product.price),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : undefined,
      sku: product.sku,
      stock: product.stock,
      categoryId: product.categoryId,
      categoryName: category?.name,
      categorySlug: category?.slug,
      images: product.images,
      tags: product.tags,
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
      averageRating: parseFloat(rv?.avg || "0"),
      reviewCount: Number(rv?.count || 0),
      createdAt: product.createdAt,
      variants: [],
      relatedProducts: relatedProducts
        .filter(r => r.product.id !== product.id)
        .slice(0, 4)
        .map(({ product: rp, category: rc }) => ({
          id: rp.id,
          name: rp.name,
          slug: rp.slug,
          price: parseFloat(rp.price),
          comparePrice: rp.comparePrice ? parseFloat(rp.comparePrice) : undefined,
          images: rp.images,
          categoryName: rc?.name,
          categorySlug: rc?.slug,
          stock: rp.stock,
          isFeatured: rp.isFeatured,
          isArchived: rp.isArchived,
        })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

export default router;
