import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product.entity';
import { Movement, MovementType } from '../entities/Movement.entity';
import { Alert } from '../entities/Alert.entity';
import { Category } from '../entities/Category.entity';

const productRepository = AppDataSource.getRepository(Product);
const movementRepository = AppDataSource.getRepository(Movement);
const alertRepository = AppDataSource.getRepository(Alert);
const categoryRepository = AppDataSource.getRepository(Category);

// Dashboard Stats - OPTIMIZADO
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Total de productos
    const totalProducts = await productRepository.count({
      where: { userId: req.userId }
    });

    // Productos con stock crítico usando SQL
    const criticalStock = await productRepository
      .createQueryBuilder('product')
      .select('COUNT(*)', 'count')
      .where('product.userId = :userId', { userId: req.userId })
      .andWhere('product.currentStock < product.minStock')
      .getRawOne();

    // Valor total del inventario usando SQL
    const inventoryValueResult = await productRepository
      .createQueryBuilder('product')
      .select('SUM(product.price * product.currentStock)', 'total')
      .where('product.userId = :userId', { userId: req.userId })
      .getRawOne();

    const inventoryValue = parseFloat(inventoryValueResult?.total || '0');

    // Alertas activas
    const activeAlerts = await alertRepository.count({
      where: { 
        userId: req.userId,
        isResolved: false
      }
    });

    // Total de categorías
    const totalCategories = await categoryRepository.count({
      where: { userId: req.userId }
    });

    // Movimientos del último mes usando SQL
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const movementsLastMonth = await movementRepository
      .createQueryBuilder('movement')
      .where('movement.userId = :userId', { userId: req.userId })
      .andWhere('movement.createdAt >= :date', { date: oneMonthAgo })
      .getCount();

    res.json({
      totalProducts,
      criticalStockCount: parseInt(criticalStock.count),
      inventoryValue: parseFloat(inventoryValue.toFixed(2)),
      activeAlerts,
      totalCategories,
      totalMovementsLastMonth: movementsLastMonth
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Productos críticos - OPTIMIZADO
export const getCriticalStockProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.userId = :userId', { userId: req.userId })
      .andWhere('product.currentStock < product.minStock')
      .orderBy('product.currentStock', 'ASC')
      .limit(10)
      .getMany();

    const formattedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      currentStock: p.currentStock,
      minStock: p.minStock,
      difference: p.minStock - p.currentStock,
      category: p.category.name,
      status: 'critical'
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Get critical stock products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Movimientos recientes - OPTIMIZADO
export const getRecentMovements = async (req: Request, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const movements = await movementRepository
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.product', 'product')
      .leftJoinAndSelect('movement.user', 'user')
      .where('movement.userId = :userId', { userId: req.userId })
      .andWhere('movement.createdAt >= :date', { date: sevenDaysAgo })
      .orderBy('movement.createdAt', 'DESC')
      .limit(20)
      .getMany();

    const formattedMovements = movements.map(m => ({
      id: m.id,
      date: m.createdAt,
      product: {
        id: m.product.id,
        name: m.product.name,
        sku: m.product.sku
      },
      type: m.type,
      quantity: m.quantity,
      reason: m.reason,
      user: m.user.name
    }));

    res.json(formattedMovements);
  } catch (error) {
    console.error('Get recent movements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Gráfica de movimientos - OPTIMIZADO
export const getMovementsChart = async (req: Request, res: Response) => {
  try {
    const { period = '7' } = req.query;
    const days = parseInt(period as string);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const chartData = await movementRepository
      .createQueryBuilder('movement')
      .select("TO_CHAR(movement.createdAt, 'YYYY-MM-DD')", 'date')
      .addSelect(
        "SUM(CASE WHEN movement.type = 'ENTRADA' THEN movement.quantity ELSE 0 END)",
        'entradas'
      )
      .addSelect(
        "SUM(CASE WHEN movement.type = 'SALIDA' THEN movement.quantity ELSE 0 END)",
        'salidas'
      )
      .where('movement.userId = :userId', { userId: req.userId })
      .andWhere('movement.createdAt >= :startDate', { startDate })
      .groupBy("TO_CHAR(movement.createdAt, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .getRawMany();

    // Convertir strings a números
    const formattedData = chartData.map(item => ({
      date: item.date,
      entradas: parseInt(item.entradas),
      salidas: parseInt(item.salidas)
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Get movements chart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Top productos - OPTIMIZADO
export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const { limit = '10', type = 'salidas' } = req.query;
    const movementType = type === 'salidas' ? MovementType.SALIDA : MovementType.ENTRADA;

    const topProducts = await movementRepository
      .createQueryBuilder('movement')
      .leftJoin('movement.product', 'product')
      .select('product.id', 'id')
      .addSelect('product.name', 'name')
      .addSelect('product.sku', 'sku')
      .addSelect('product.currentStock', 'currentStock')
      .addSelect('SUM(movement.quantity)', 'totalQuantity')
      .where('movement.userId = :userId', { userId: req.userId })
      .andWhere('movement.type = :type', { type: movementType })
      .groupBy('product.id')
      .addGroupBy('product.name')
      .addGroupBy('product.sku')
      .addGroupBy('product.currentStock')
      .orderBy('"totalQuantity"', 'DESC')
      .limit(parseInt(limit as string))
      .getRawMany();

    const formattedData = topProducts.map(item => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      currentStock: item.currentStock,
      totalQuantity: parseInt(item.totalQuantity)
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Baja rotación - OPTIMIZADO
export const getLowRotationProducts = async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;

    const products = await productRepository
      .createQueryBuilder('product')
      .leftJoin('product.movements', 'movement')
      .leftJoinAndSelect('product.category', 'category')
      .select('product.id', 'id')
      .addSelect('product.name', 'name')
      .addSelect('product.sku', 'sku')
      .addSelect('product.currentStock', 'currentStock')
      .addSelect('category.name', 'category')
      .addSelect('COUNT(movement.id)', 'movementCount')
      .where('product.userId = :userId', { userId: req.userId })
      .groupBy('product.id')
      .addGroupBy('product.name')
      .addGroupBy('product.sku')
      .addGroupBy('product.currentStock')
      .addGroupBy('category.name')
      .orderBy('"movementCount"', 'ASC')
      .limit(parseInt(limit as string))
      .getRawMany();

    const formattedData = products.map(item => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      category: item.category,
      currentStock: item.currentStock,
      movementCount: parseInt(item.movementCount)
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Get low rotation products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Stock por categoría - OPTIMIZADO
export const getStockByCategory = async (req: Request, res: Response) => {
  try {
    const categoryStats = await productRepository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(product.id)', 'productCount')
      .addSelect('SUM(product.currentStock)', 'totalStock')
      .addSelect('SUM(product.price * product.currentStock)', 'totalValue')
      .where('product.userId = :userId', { userId: req.userId })
      .groupBy('category.id')
      .addGroupBy('category.name')
      .getRawMany();

    const formattedData = categoryStats.map(item => ({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      productCount: parseInt(item.productCount),
      totalStock: parseInt(item.totalStock || '0'),
      totalValue: parseFloat(parseFloat(item.totalValue || '0').toFixed(2))
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Get stock by category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reporte personalizado - OPTIMIZADO
export const getCustomReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Totales usando SQL
    const summary = await movementRepository
      .createQueryBuilder('movement')
      .select(
        "SUM(CASE WHEN movement.type = 'ENTRADA' THEN movement.quantity ELSE 0 END)",
        'totalEntradas'
      )
      .addSelect(
        "SUM(CASE WHEN movement.type = 'SALIDA' THEN movement.quantity ELSE 0 END)",
        'totalSalidas'
      )
      .addSelect('COUNT(*)', 'totalMovements')
      .where('movement.userId = :userId', { userId: req.userId })
      .andWhere('movement.createdAt BETWEEN :start AND :end', { start, end })
      .getRawOne();

    // Top productos más movidos
    const topMovedProducts = await movementRepository
      .createQueryBuilder('movement')
      .leftJoin('movement.product', 'product')
      .select('product.name', 'name')
      .addSelect('product.sku', 'sku')
      .addSelect('SUM(movement.quantity)', 'totalMoved')
      .where('movement.userId = :userId', { userId: req.userId })
      .andWhere('movement.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('product.name')
      .addGroupBy('product.sku')
      .orderBy('"totalMoved"', 'DESC')
      .limit(10)
      .getRawMany();

    res.json({
      period: { start: startDate, end: endDate },
      summary: {
        totalMovements: parseInt(summary.totalMovements),
        totalEntradas: parseInt(summary.totalEntradas || '0'),
        totalSalidas: parseInt(summary.totalSalidas || '0'),
        balance: parseInt(summary.totalEntradas || '0') - parseInt(summary.totalSalidas || '0')
      },
      topMovedProducts: topMovedProducts.map(item => ({
        name: item.name,
        sku: item.sku,
        totalMoved: parseInt(item.totalMoved)
      }))
    });
  } catch (error) {
    console.error('Get custom report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};