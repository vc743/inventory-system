import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Movement, MovementType } from "../entities/Movement.entity";
import { Product } from "../entities/Product.entity";
import { Alert } from "../entities/Alert.entity";

const movementRepository = AppDataSource.getRepository(Movement);
const productRepository = AppDataSource.getRepository(Product);
const alertRepository = AppDataSource.getRepository(Alert);

export const getAllMovements = async (req: Request, res: Response) => {
  try {
    const { productId, type, startDate, endDate } = req.query;

    const where: any = {};

    if (productId) {
      where.productId = productId;
    }

    if (type && (type === "ENTRADA" || type === "SALIDA")) {
      where.type = type;
    }

    const movements = await movementRepository.find({
      where,
      relations: ["product", "user"],
      order: { createdAt: "DESC" },
    });

    let filteredMovements = movements;
    if (startDate || endDate) {
      filteredMovements = movements.filter((movement) => {
        const movementDate = new Date(movement.createdAt);

        if (startDate && endDate) {
          return (
            movementDate >= new Date(startDate as string) &&
            movementDate <= new Date(endDate as string)
          );
        } else if (startDate) {
          return movementDate >= new Date(startDate as string);
        } else if (endDate) {
          return movementDate <= new Date(endDate as string);
        }

        return true;
      });
    }

    const formattedMovements = filteredMovements.map((movement) => ({
      id: movement.id,
      productId: movement.productId,
      product: {
        id: movement.product.id,
        name: movement.product.name,
        sku: movement.product.sku,
        currentStock: movement.product.currentStock,
      },
      type: movement.type,
      quantity: movement.quantity,
      reason: movement.reason,
      notes: movement.notes,
      user: {
        id: movement.user.id,
        name: movement.user.name,
        email: movement.user.email,
      },
      createdAt: movement.createdAt,
    }));

    res.json(formattedMovements);
  } catch (error) {
    console.error("Get movements error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMovementById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const movement = await movementRepository.findOne({
      where: { id },
      relations: ["product", "product.category", "user"],
    });

    if (!movement) {
      return res.status(404).json({ error: "Movement not found" });
    }

    // Verificar que el movimiento pertenece a un producto del usuario
    if (movement.product.userId !== req.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      id: movement.id,
      productId: movement.productId,
      product: {
        id: movement.product.id,
        name: movement.product.name,
        sku: movement.product.sku,
        currentStock: movement.product.currentStock,
        category: movement.product.category,
      },
      type: movement.type,
      quantity: movement.quantity,
      reason: movement.reason,
      notes: movement.notes,
      user: {
        id: movement.user.id,
        name: movement.user.name,
        email: movement.user.email,
      },
      createdAt: movement.createdAt,
    });
  } catch (error) {
    console.error("Get movement error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createMovement = async (req: Request, res: Response) => {
  try {
    const { productId, type, quantity, reason, notes } = req.body;

    // Validaciones
    if (!productId || !type || !quantity || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (type !== "ENTRADA" && type !== "SALIDA") {
      return res.status(400).json({ error: "Invalid movement type" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    // Verificar que el producto existe y pertenece al usuario
    const product = await productRepository.findOne({
      where: { id: productId, userId: req.userId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Calcular nuevo stock
    const parsedQuantity = parseInt(quantity);
    let newStock: number;

    if (type === "ENTRADA") {
      newStock = product.currentStock + parsedQuantity;
    } else {
      newStock = product.currentStock - parsedQuantity;

      if (newStock <= 0) {
        return res.status(400).json({
          error: "Insufficient stock",
          currentStock: product.currentStock,
          requested: parsedQuantity,
        });
      }
    }

    // Crear el movimiento
    const movement = movementRepository.create({
      productId,
      type: type as MovementType,
      quantity: parsedQuantity,
      reason,
      notes,
      userId: req.userId!,
    });

    await movementRepository.save(movement);

    // Actualizar el stock del producto
    product.currentStock = newStock;
    await productRepository.save(product);

    // Gestion de alertas
    if (newStock < product.minStock) {
      // Stock bajo - crear alerta si no existe una activa
      const existingAlert = await alertRepository.findOne({
        where: {
          productId: product.id,
          isResolved: false,
        },
      });

      if (!existingAlert) {
        const alert = alertRepository.create({
          productId: product.id,
          userId: req.userId!,
        });
        await alertRepository.save(alert);
      }
    } else {
      // Stock suficiente - resolver alertas activas
      const activeAlerts = await alertRepository.find({
        where: {
          productId: product.id,
          isResolved: false,
        },
      });

      for (const alert of activeAlerts) {
        alert.isResolved = true;
        alert.resolvedAt = new Date();
        await alertRepository.save(alert);
      }
    }

    // Obtener el movimiento completo con relaciones
    const savedMovement = await movementRepository.findOne({
      where: { id: movement.id },
      relations: ["product", "user"],
    });

    res.status(201).json({
      movement: {
        id: savedMovement!.id,
        productId: savedMovement!.productId,
        type: savedMovement!.type,
        quantity: savedMovement!.quantity,
        reason: savedMovement!.reason,
        notes: savedMovement!.notes,
        createdAt: savedMovement!.createdAt,
      },
      product: {
        id: product.id,
        name: product.name,
        previousStock:
          product.currentStock -
          (type === "ENTRADA" ? parsedQuantity : -parsedQuantity),
        currentStock: product.currentStock,
        minStock: product.minStock,
      },
    });
  } catch (error) {
    console.error("Create movement error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMovement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const movement = await movementRepository.findOne({
      where: { id },
      relations: ["product"],
    });

    if (!movement) {
      return res.status(404).json({ error: "Movement not found" });
    }

    // Verificar que el movimiento pertenece a un producto del usuario
    if (movement.product.userId !== req.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Revertir el movimiento en el stock
    const product = movement.product;

    if (movement.type === "ENTRADA") {
      product.currentStock -= movement.quantity;
    } else {
      product.currentStock += movement.quantity;
    }

    await productRepository.save(product);

    // Eliminar el movimiento
    await movementRepository.remove(movement);

    // Actualizar alertas si es necesario
    if (product.currentStock < product.minStock) {
      const existingAlert = await alertRepository.findOne({
        where: {
          productId: product.id,
          isResolved: false,
        },
      });

      if (!existingAlert) {
        const alert = alertRepository.create({
          productId: product.id,
          userId: req.userId!,
        });
        await alertRepository.save(alert);
      }
    }

    res.json({
      message: "Movement deleted succesfully",
      newStock: product.currentStock,
    });
  } catch (error) {
    console.error("Delete movement error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
