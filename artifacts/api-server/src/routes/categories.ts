import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db/schema";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
    const result = await Promise.all(categories.map(async (cat) => {
      const [cnt] = await db.select({ count: count() }).from(productsTable).where(eq(productsTable.categoryId, cat.id));
      return { ...cat, productCount: Number(cnt?.count || 0) };
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

export default router;
