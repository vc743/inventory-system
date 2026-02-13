import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "./Product.entity";
import { User } from "./User.entity";

@Entity("alerts")
export class Alert {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  productId: string;

  @Column()
  userId: string;

  @Column({ default: false })
  isResolved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "timestamp", nullable: true })
  resolvedAt: Date;

  @ManyToOne(() => Product, (product) => product.alerts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  product: Product;

  @ManyToOne(() => User, (user) => user.alerts)
  @JoinColumn({ name: "userId" })
  user: User;
}
