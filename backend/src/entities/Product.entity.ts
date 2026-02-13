import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User.entity";
import { Category } from "./Category.entity";
import { Movement } from "./Movement.entity";
import { Alert } from "./Alert.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "int" })
  minStock: number;

  @Column({ type: "int" })
  currentStock: number;

  @Column({ nullable: true })
  barcode: string;

  @Column()
  categoryId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @ManyToOne(() => User, (user) => user.products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => Movement, (movement) => movement.product)
  movements: Movement[];

  @OneToMany(() => Alert, (alert) => alert.product)
  alerts: Alert[];
}
