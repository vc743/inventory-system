import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User.entity";
import { Category } from "../entities/Category.entity";
import { Product } from "../entities/Product.entity";
import { Movement } from "../entities/Movement.entity";
import { Alert } from "../entities/Alert.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [User, Category, Product, Movement, Alert],
  migrations: [],
  subscribers: [],
});
