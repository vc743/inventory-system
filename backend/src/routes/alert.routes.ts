import { Router } from "express";
import {
  getAllAlerts,
  getAlertById,
  getAlertStats,
  deleteAlert,
  resolveAlert,
} from "../controllers/alert.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllAlerts);
router.get("/stats", getAlertStats);
router.get("/:id", getAlertById);
router.patch("/:id/resolve", resolveAlert);
router.delete("/:id", deleteAlert);

export default router;
