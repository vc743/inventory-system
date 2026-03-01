import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import movementRoutes from "./routes/movement.routes";
import alertRoutes from "./routes/alert.routes";
import reportRoutes from "./routes/report.routes";
import {
  loggerMiddleware,
  errorLoggerMiddleware,
} from "./middlewares/logger.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/movements", movementRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/reports", reportRoutes);

app.use(errorLoggerMiddleware);

// Inicializar base de datos y servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    console.log("Tables synchronized");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
