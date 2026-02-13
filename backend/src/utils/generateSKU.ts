import { AppDataSource } from "../config/database";
import { Product } from "../entities/Product.entity";

export const generateSKU = async (): Promise<string> => {
    const productRepository = AppDataSource.getRepository(Product)

    let sku: string;
    let exists = true;

    while (exists) {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        sku = `SKU-${timestamp}${random}`;

        // Verifica si el SKU ya existe
        const existingProduct = await productRepository.findOne({ where: { sku } });
        exists = !!existingProduct;
    }

    return sku!;
}