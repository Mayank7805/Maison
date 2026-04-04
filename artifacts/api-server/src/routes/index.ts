import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import categoriesRouter from "./categories.js";
import searchRouter from "./search.js";
import cartRouter from "./cart.js";
import ordersRouter from "./orders.js";
import usersRouter from "./users.js";
import wishlistRouter from "./wishlist.js";
import reviewsRouter from "./reviews.js";
import adminRouter from "./admin.js";
import checkoutRouter from "./checkout.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/search", searchRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/users", usersRouter);
router.use("/wishlist", wishlistRouter);
router.use("/reviews", reviewsRouter);
router.use("/admin", adminRouter);
router.use("/checkout", checkoutRouter);
router.use("/coupons", checkoutRouter);

export default router;
