import { Router } from "express"
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller"
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Todas las rutas requieren autenticacion
router.use(authMiddleware);

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;