import api from "@/infrastructure/api";
import {
  categoryListSchema,
  categorySchema,
  type CategoryFormType,
  type CategoryListItemType,
  type CategoryType,
} from "@/infrastructure/schemas/category/category";
import { handleApiError } from "@/infrastructure/api/handleApiError";

interface UpdateCategoryParams {
  id: number;
  formData: CategoryFormType;
}

export const getCategories = async (): Promise<CategoryListItemType[]> => {
  try {
    const url = "/categories";

    const { data } = await api.get(url);

    return categoryListSchema.parse(data);
  } catch (error) {
    handleApiError(error, "Error al obtener las categorías");
  }
};

export const createCategory = async (
  formData: CategoryFormType,
): Promise<CategoryType> => {
  try {
    const url = "/categories";

    const { data } = await api.post(url, formData);

    return categorySchema.parse(data);
  } catch (error) {
    handleApiError(error, "Error al crear la categoría");
  }
};

export const updateCategory = async ({
  id,
  formData,
}: UpdateCategoryParams): Promise<CategoryType> => {
  try {
    const url = `/categories/${id}`;

    const { data } = await api.put(url, formData);

    return categorySchema.parse(data);
  } catch (error) {
    handleApiError(error, "Error al actualizar la categoría");
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    const url = `/categories/${id}`;

    await api.delete(url);
  } catch (error) {
    handleApiError(error, "Error al eliminar la categoría");
  }
};