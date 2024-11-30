import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { AdminService } from '../admin/admin.service';
import { JwtStrategy } from '../common/jwt/jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { GroceryItem } from '../entities/grocery-item.entity';
import { JwtService } from '@nestjs/jwt';

describe('AppModule', () => {
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should import AdminModule and JwtModule', () => {
    const adminService = app.get<AdminService>(AdminService);
    const jwtService = app.get<JwtService>(JwtService);

    expect(adminService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should import TypeOrmModule and AdminRepository', async () => {
    const adminRepository = app.get(getRepositoryToken(Admin));
    const groceryItemRepository = app.get(getRepositoryToken(GroceryItem));

    expect(adminRepository).toBeDefined();
    expect(groceryItemRepository).toBeDefined();
  });
});
