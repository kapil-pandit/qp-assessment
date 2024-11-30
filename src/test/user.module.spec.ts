import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { UserController } from '../user/user.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GroceryItem } from '../entities/grocery-item.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { OrderItem } from '../entities/order-item.entity';

describe('UserModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forFeature([GroceryItem, Order, User, OrderItem]),
        JwtModule.register({
          secret: 'secretKey',
          signOptions: { expiresIn: '23h' },
        }),
      ],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should compile the module', async () => {
    const userModule = module.get<UserModule>(UserModule);
    expect(userModule).toBeDefined();
  });

  it('should provide UserService', async () => {
    const userService = module.get<UserService>(UserService);
    expect(userService).toBeDefined();
  });

  it('should provide UserController', async () => {
    const userController = module.get<UserController>(UserController);
    expect(userController).toBeDefined();
  });

  it('should inject TypeOrm repositories', async () => {
    const groceryItemRepo = module.get(getRepositoryToken(GroceryItem));
    const orderRepo = module.get(getRepositoryToken(Order));
    const userRepo = module.get(getRepositoryToken(User));
    const orderItemRepo = module.get(getRepositoryToken(OrderItem));

    expect(groceryItemRepo).toBeDefined();
    expect(orderRepo).toBeDefined();
    expect(userRepo).toBeDefined();
    expect(orderItemRepo).toBeDefined();
  });

  it('should configure JwtModule with secretKey and expiry', async () => {
    const jwtModuleOptions = module
      .select(JwtModule)
      .get(JwtModule, { strict: false })
      ['options'];

    expect(jwtModuleOptions.secret).toEqual('secretKey');
    expect(jwtModuleOptions.signOptions.expiresIn).toEqual('23h');
  });
});
