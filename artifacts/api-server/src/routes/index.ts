import { Router, type IRouter } from "express";
import healthRouter from "./health";
import organizationsRouter from "./organizations";
import industryPacksRouter from "./industryPacks";
import usersRouter from "./users";
import subscriptionsRouter from "./subscriptions";
import dashboardRouter from "./dashboard";
import modulesRouter from "./modules";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/organizations", organizationsRouter);
router.use("/industry-packs", industryPacksRouter);
router.use("/users", usersRouter);
router.use("/subscriptions", subscriptionsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/modules", modulesRouter);

export default router;
