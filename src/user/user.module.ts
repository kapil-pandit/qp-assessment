import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GroceryItem } from '../entities/grocery-item.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { OrderItem } from '../entities/order-item.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroceryItem, Order, User, OrderItem]),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secretKey', // You can store this in environment variables
      signOptions: { expiresIn: '23h' }, // Token expiry
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
