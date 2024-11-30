import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from '../entities/admin.entity';
import { GroceryItem } from '../entities/grocery-item.entity';
import { JwtModule } from '../common/jwt/jwt.module'; // Import the JwtModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, GroceryItem]), // TypeORM repositories
    JwtModule, // Ensure JwtModule is imported here
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
