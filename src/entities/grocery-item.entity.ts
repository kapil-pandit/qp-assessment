import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GroceryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  quantity: number;
}
