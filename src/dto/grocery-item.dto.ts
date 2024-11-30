import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class GroceryItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}
