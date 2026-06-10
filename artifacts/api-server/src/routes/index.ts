import { Router, type IRouter } from "express";
import healthRouter    from "./health";
import ordersRouter    from "./orders";
import productsRouter  from "./products";
import customersRouter from "./customers";
import dashboardRouter from "./dashboard";
import authRouter      from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth",      authRouter);
router.use("/orders",    ordersRouter);
router.use("/products",  productsRouter);
router.use("/customers", customersRouter);
router.use("/dashboard", dashboardRouter);

export default router;
