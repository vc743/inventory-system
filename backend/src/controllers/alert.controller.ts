import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Alert } from "../entities/Alert.entity";

const alertRepository = AppDataSource.getRepository(Alert);

export const getAllAlerts = async (req: Request, res: Response) => {
  try {
    const { status } = req.query; // active, resolved, all

    const where: any = {
      userId: req.userId,
    };

    // Filtrar por estado
    if (status === "active") {
      where.isResolved = false;
    } else if (status === "resolved") {
      where.isResolved = true;
    }
    // Si status es "all" o no se proporciona, traer todas

    const alerts = await alertRepository.find({
      where,
      relations: ["product", "product.category"],
      order: { createdAt: "DESC" },
    });

    const formattedAlerts = alerts.map((alert) => ({
      id: alert.id,
      product: {
        id: alert.product.id,
        name: alert.product.name,
        sku: alert.product.sku,
        currentStock: alert.product.currentStock,
        minStock: alert.product.minStock,
        category: alert.product.category,
      },
      isResolved: alert.isResolved,
      createdAt: alert.createdAt,
      resolvedAt: alert.resolvedAt,
    }));

    res.json(formattedAlerts);
  } catch (error) {
    console.error("Get alerts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAlertById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const alert = await alertRepository.findOne({
      where: { id, userId: req.userId },
      relations: ["product", "product.category"],
    });

    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    res.json({
      id: alert.id,
      product: {
        id: alert.product.id,
        name: alert.product.name,
        sku: alert.product.sku,
        currentStock: alert.product.currentStock,
        minStock: alert.product.minStock,
        category: alert.product.category,
      },
      isResolved: alert.isResolved,
      createdAt: alert.createdAt,
      resolvedAt: alert.resolvedAt,
    });
  } catch (error) {
    console.error("Get alert error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resolveAlert = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const alert = await alertRepository.findOne({
      where: { id, userId: req.userId },
      relations: ["product"],
    });

    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    if (alert.isResolved) {
      return res.status(400).json({ error: "Alert is already resolved" });
    }

    alert.isResolved = true;
    alert.resolvedAt = new Date();
    await alertRepository.save(alert);

    res.json({
      message: "Alert resolved successfully",
      alert: {
        id: alert.id,
        productId: alert.productId,
        isResolved: alert.isResolved,
        resolvedAt: alert.resolvedAt,
      },
    });
  } catch (error) {
    console.error("Resolve alert error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAlertStats = async (req: Request, res: Response) => {
  try {
    const totalAlerts = await alertRepository.count({
      where: { userId: req.userId },
    });

    const activeAlerts = await alertRepository.count({
      where: {
        userId: req.userId,
        isResolved: false,
      },
    });

    const resolvedAlerts = await alertRepository.count({
      where: {
        userId: req.userId,
        isResolved: true,
      },
    });

    res.json({
      total: totalAlerts,
      active: activeAlerts,
      resolved: resolveAlert,
    });
  } catch (error) {
    console.error("Get alert stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const alert = await alertRepository.findOne({
      where: { id, userId: req.userId },
    });

    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    await alertRepository.remove(alert);

    res.json({ message: "Alert deleted successfully" })
  } catch (error) {
    console.error("Delete alert error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
