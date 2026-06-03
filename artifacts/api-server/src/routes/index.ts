import { Router, type IRouter } from "express";
import healthRouter from "./health";
import carriersRouter from "./carriers";
import shipmentsRouter from "./shipments";
import dashboardRouter from "./dashboard";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(carriersRouter);
router.use(shipmentsRouter);
router.use(dashboardRouter);
router.use(contactRouter);

export default router;
