import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Category } from "../entities/Category.entity";

const categoryRepository = AppDataSource.getRepository(Category);

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryRepository.find({
      where: { userId: req.userId },
      relations: ["products"],
      order: { name: "ASC" },
    });

    // Mapear para incluir el conteo de productos
    const categoriesWithCount = categories.map((category) => ({
      id: category.id,
      name: category.name,
      userId: category.userId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      product: category.products?.length || 0,
    }));

    res.json(categoriesWithCount);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const category = await categoryRepository.findOne({
      where: { id, userId: req.userId },
      relations: ["products"],
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const category = categoryRepository.create({
      name: name.trim(),
      userId: req.userId!,
    });

    await categoryRepository.save(category);

    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    // Verificar que la categoria pertenece el usuario
    const category = await categoryRepository.findOne({
      where: { id, userId: req.userId },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name.trim();
    await categoryRepository.save(category);

    res.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // Verificar que la categoria pertenece al usuario
    const category = await categoryRepository.findOne({
      where: { id, userId: req.userId },
      relations: ["products"],
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Verificar si tiene productos asociados
    if (category.products && category.products.length > 0) {
      return res.status(400).json({
        error: "Cannot delete category with associated products",
        productCount: category.products.length,
      });
    }

    await categoryRepository.remove(category);

    res.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
