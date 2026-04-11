import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable, usersTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../lib/auth.js";

const router = Router();

router.get("/:productId", async (req, res) => {
  try {
    const reviews = await db
      .select({ review: reviewsTable, user: usersTable })
      .from(reviewsTable)
      .leftJoin(usersTable, eq(reviewsTable.userId, usersTable.id))
      .where(eq(reviewsTable.productId, req.params["productId"]))
      .orderBy(desc(reviewsTable.createdAt));

    res.json(reviews.map(({ review, user }) => ({
      id: review.id,
      userId: review.userId,
      userName: user?.name || "Anonymous",
      userAvatar: user?.avatar,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

router.post("/", authMiddleware as any, async (req: AuthRequest, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) return res.status(400).json({ message: "productId and rating are required" });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be 1-5" });

    const [review] = await db.insert(reviewsTable).values({
      userId: req.user!.id,
      productId,
      rating,
      comment,
    }).returning();

    res.status(201).json({
      id: review.id,
      userId: review.userId,
      userName: req.user!.name,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create review" });
  }
});

export default router;
