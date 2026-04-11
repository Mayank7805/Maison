import { Router } from "express";
import { db } from "@workspace/db";
import { couponsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const router = Router();

function getStripe() {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) return null;
  return new Stripe(key);
}

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const stripe = getStripe();
    if (!stripe) {
      return res.json({
        clientSecret: "mock_secret_for_development",
        paymentIntentId: "mock_intent_" + Date.now(),
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
});

router.post("/coupons/validate", async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ message: "Code is required" });

    const [coupon] = await db.select().from(couponsTable).where(eq(couponsTable.code, code.toUpperCase()));
    if (!coupon || coupon.isActive !== "true") {
      return res.json({ valid: false, message: "Invalid coupon code" });
    }
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.json({ valid: false, message: "Coupon has expired" });
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.json({ valid: false, message: "Coupon usage limit reached" });
    }
    if (coupon.minOrder && orderTotal < parseFloat(coupon.minOrder)) {
      return res.json({ valid: false, message: `Minimum order of $${coupon.minOrder} required` });
    }

    let discount = 0;
    if (coupon.type === "PERCENT") {
      discount = orderTotal * (parseFloat(coupon.value) / 100);
    } else {
      discount = parseFloat(coupon.value);
    }

    res.json({ valid: true, discount: Math.min(discount, orderTotal), type: coupon.type, message: "Coupon applied!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to validate coupon" });
  }
});

export default router;
