import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, addressesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware, hashPassword, type AuthRequest } from "../lib/auth.js";

const router = Router();

router.put("/profile", authMiddleware as any, async (req: AuthRequest, res) => {
  try {
    const { name, email, avatar } = req.body;
    const [user] = await db.update(usersTable)
      .set({ name, email, avatar, updatedAt: new Date() })
      .where(eq(usersTable.id, req.user!.id))
      .returning();
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, createdAt: user.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

router.get("/addresses", authMiddleware as any, async (req: AuthRequest, res) => {
  try {
    const addresses = await db.select().from(addressesTable).where(eq(addressesTable.userId, req.user!.id));
    res.json(addresses.map(a => ({
      id: a.id, userId: a.userId, fullName: a.fullName, line1: a.line1,
      line2: a.line2, city: a.city, state: a.state, zip: a.zip,
      country: a.country, isDefault: a.isDefault === "true",
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
});

router.post("/addresses", authMiddleware as any, async (req: AuthRequest, res) => {
  try {
    const { fullName, line1, line2, city, state, zip, country, isDefault } = req.body;
    if (isDefault) {
      await db.update(addressesTable).set({ isDefault: "false" }).where(eq(addressesTable.userId, req.user!.id));
    }
    const [address] = await db.insert(addressesTable).values({
      userId: req.user!.id, fullName, line1, line2, city, state, zip,
      country: country || "US", isDefault: isDefault ? "true" : "false",
    }).returning();
    res.status(201).json({ ...address, isDefault: address.isDefault === "true" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create address" });
  }
});

router.put("/addresses/:id", authMiddleware as any, async (req: AuthRequest, res) => {
  try {
    const { fullName, line1, line2, city, state, zip, country, isDefault } = req.body;
    if (isDefault) {
      await db.update(addressesTable).set({ isDefault: "false" }).where(eq(addressesTable.userId, req.user!.id));
    }
    const [address] = await db.update(addressesTable)
      .set({ fullName, line1, line2, city, state, zip, country: country || "US", isDefault: isDefault ? "true" : "false" })
      .where(eq(addressesTable.id, req.params["id"]))
      .returning();
    res.json({ ...address, isDefault: address.isDefault === "true" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update address" });
  }
});

router.delete("/addresses/:id", authMiddleware as any, async (req: AuthRequest, res) => {
  try {
    await db.delete(addressesTable).where(eq(addressesTable.id, req.params["id"]));
    res.json({ message: "Address deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete address" });
  }
});

export default router;
