import { Router, type IRouter } from "express";
import healthRouter                from "./health";
import ordersRouter                from "./orders";
import productsRouter              from "./products";
import customizeProductsRouter     from "./customizeProducts";
import customersRouter             from "./customers";
import dashboardRouter             from "./dashboard";
import authRouter                  from "./auth";
import uploadRouter                from "./upload";
import homepageCategoriesRouter    from "./homepageCategories";
import homepageCmsRouter           from "./homepageCms";
import featuredProductsRouter      from "./featuredProducts";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth",                  authRouter);
router.use("/orders",                ordersRouter);
router.use("/products",              productsRouter);
router.use("/customize-products",    customizeProductsRouter);
router.use("/customers",             customersRouter);
router.use("/dashboard",             dashboardRouter);
router.use("/upload",                uploadRouter);
router.use("/homepage-categories",   homepageCategoriesRouter);
router.use("/homepage-cms",          homepageCmsRouter);
router.use("/featured-products",     featuredProductsRouter);

export default router;
