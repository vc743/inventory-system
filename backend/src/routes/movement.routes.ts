import { Router } from "express";
import {
  getAllMovements,
  getMovementById,
  createMovement,
  deleteMovement,
} from "../controllers/movement.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllMovements);
router.get("/:id", getMovementById);
router.post("/", createMovement);
router.delete("/:id", deleteMovement);

export default router;