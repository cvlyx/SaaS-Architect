import { Router, type IRouter } from "express";
import healthRouter from "./health";
import industryPacksRouter from "./industryPacks";
import subscriptionsRouter from "./subscriptions";
import organizationsRouter from "./organizations";
import usersRouter from "./users";
import modulesRouter from "./modules";
import dashboardRouter from "./dashboard";
import authRouter from "./auth";
import educationRouter from "./education";
import industriesRouter from "./industries";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/industry-packs", industryPacksRouter);
router.use("/subscriptions", subscriptionsRouter);
router.use("/organizations", organizationsRouter);
router.use("/users", usersRouter);
router.use("/modules", modulesRouter);
router.use("/dashboard", dashboardRouter);
router.use("/education", educationRouter);
router.use("/industries", industriesRouter);

export default router;
