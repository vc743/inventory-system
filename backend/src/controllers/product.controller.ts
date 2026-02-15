import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Product } from "../entities/Product.entity";
import { Category } from "../entities/Category.entity";
import { Alert } from "../entities/Alert.entity";
import { generateSKU } from "../utils/generateSKU";
import { ILike } from "typeorm";

const productRepository = AppDataSource.getRepository(Product);
const categoryRepository = AppDataSource.getRepository(Category);
const alertRepository = AppDataSource.getRepository(Alert);

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { category, status, search } = req.query;

    const where: any = {
      userId: req.userId,
    };

    // Filtro por categoria
    if (category) {
      where.categoryId = category;
    }

    // Filtro por busqueda (nombre o SKU)
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    let products = await productRepository.find({
      where,
      relations: ["category"],
      order: { createdAt: "DESC" },
    });

    // Filtro por estado de stock (se aplica despues de traer los datos)
    if (status === "critico") {
      products = products.filter((p) => p.currentStock < p.minStock);
    } else if (status === "bajo") {
      products = products.filter(
        (p) =>
          p.currentStock >= p.minStock && p.currentStock < p.minStock * 1.5,
      );
    } else if (status === "suficiente") {
      products = products.filter((p) => p.currentStock >= p.minStock * 1.5);
    }

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const product = await productRepository.findOne({
      where: { id, userId: req.userId },
      relations: ["category", "movements", "movements.user"],
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      minStock,
      currentStock,
      categoryId,
      barcode,
    } = req.body;

    if (
      !name ||
      price === undefined ||
      minStock === undefined ||
      currentStock === undefined ||
      !categoryId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (price < 0 || minStock < 0 || currentStock < 0) {
      return res.status(400).json({ error: "Values cannot be negative" });
    }

    // Verificar que la categoria existe y pertenece al usuario
    const category = await categoryRepository.findOne({
      where: { id: categoryId, userId: req.userId },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Generar SKU unico
    const sku = await generateSKU();

    const product = productRepository.create({
      sku,
      name,
      description,
      price: parseFloat(price),
      minStock: parseInt(minStock),
      currentStock: parseInt(currentStock),
      categoryId,
      userId: req.userId!,
      barcode,
    });

    await productRepository.save(product);

    // Crear alerta si el stock inicial ya es bajo
    if (product.currentStock > product.minStock) {
      const alert = alertRepository.create({
        productId: product.id,
        userId: req.userId!,
      });
      await alertRepository.save(alert);
    }

    // Obtener el producto con la relacion de categoria
    const savedProduct = await productRepository.findOne({
      where: { id: product.id },
      relations: ["category"],
    });

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, price, minStock, categoryId, barcode } =
      req.body;

    // Verificar que el producto existe y pertenece al usuario
    const product = await productRepository.findOne({
      where: { id, userId: req.userId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Si se cambia la cetagoria, verificar que existe
    if (categoryId && categoryId !== product.categoryId) {
      const category = await categoryRepository.findOne({
        where: { id: categoryId, userId: req.userId },
      });

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      product.categoryId = categoryId;
    }

    // Actualizar campos
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (minStock !== undefined) product.minStock = parseInt(minStock);
    if (barcode !== undefined) product.barcode = barcode;

    await productRepository.save(product);

    // Obtener el producto actualizado con relaciones
    const updatedProduct = await productRepository.findOne({
      where: { id },
      relations: ["category"],
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // Verificar que el producto existe y pertenece al usuario
    const product = await productRepository.findOne({
      where: { id, userId: req.userId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await productRepository.remove(product);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
