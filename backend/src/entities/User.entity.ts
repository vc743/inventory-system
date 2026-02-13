import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Category } from "./Category.entity";
import { Product } from "./Product.entity";
import { Movement } from "./Movement.entity";
import { Alert } from "./Alert.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Movement, (movement) => movement.user)
  movements: Movement[];

  @OneToMany(() => Alert, (alert) => alert.user)
  alerts: Alert[];
}
