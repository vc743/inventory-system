import { Router } from "express";
import {
  getDashboardStats,
  getCriticalStockProducts,
  getRecentMovements,
  getMovementsChart,
  getTopProducts,
  getLowRotationProducts,
  getStockByCategory,
  getCustomReport,
} from "../controllers/report.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/dashboard", getDashboardStats);
router.get("/dashboard/critical-stock", getCriticalStockProducts);
router.get("/dashboard/recent-movements", getRecentMovements);

router.get("/chart/movements", getMovementsChart);
router.get("/top-products", getTopProducts);
router.get("/low-rotation", getLowRotationProducts);
router.get("/stock-by-category", getStockByCategory);

router.get("/custom", getCustomReport);

export default router;
