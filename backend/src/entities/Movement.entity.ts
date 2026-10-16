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

export enum MovementType {
  ENTRADA = "ENTRADA",
  SALIDA = "SALIDA",
}

@Entity("movements")
export class Movement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column({
    type: "enum",
    enum: MovementType,
  })
  type: MovementType;

  @Column({ type: "int" })
  quantity: number;

  @Column()
  reason: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.movements, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  product: Product;

  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn({ name: "userId" })
  user: User;
}
