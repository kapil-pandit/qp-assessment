import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { UserRegisterDto } from 'src/dto/user-register.dto';
import { UserLoginDto } from 'src/dto/user-login.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    register: jest.fn(),
    login: jest.fn(),
    viewGroceryItems: jest.fn(),
    placeOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case for user registration
  describe('register', () => {
    it('should call userService.register with the correct parameters', async () => {
      const userRegisterDto: UserRegisterDto = {
        username: 'testuser',
        password: 'password123',
      };
      mockUserService.register.mockResolvedValue({ message: 'User registered successfully' });

      const result = await userController.register(userRegisterDto);

      expect(mockUserService.register).toHaveBeenCalledWith(userRegisterDto);
      expect(result).toEqual({ message: 'User registered successfully' });
    });
  });

  // Test case for user login
  describe('login', () => {
    it('should call userService.login with the correct parameters', async () => {
      const userLoginDto: UserLoginDto = {
        username: 'testuser',
        password: 'password123',
      };
      mockUserService.login.mockResolvedValue({ accessToken: 'jwt-token' });

      const result = await userController.login(userLoginDto);

      expect(mockUserService.login).toHaveBeenCalledWith(userLoginDto);
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });
  });

  // Test case for viewing grocery items
  describe('viewGroceryItems', () => {
    it('should return the list of grocery items', async () => {
      const groceryItems = [
        { id: 1, name: 'Apple', price: 100, stock: 50 },
        { id: 2, name: 'Banana', price: 50, stock: 100 },
      ];
      mockUserService.viewGroceryItems.mockResolvedValue(groceryItems);

      const result = await userController.viewGroceryItems();

      expect(mockUserService.viewGroceryItems).toHaveBeenCalledTimes(1);
      expect(result).toEqual(groceryItems);
    });
  });

  // Test case for placing an order
  describe('placeOrder', () => {
    it('should call userService.placeOrder with correct parameters', async () => {
      const userId = 1;
      const groceryItems = [
        { itemId: 1, quantity: 2 },
        { itemId: 2, quantity: 3 },
      ];
      mockUserService.placeOrder.mockResolvedValue({ message: 'Order placed successfully' });

      const result = await userController.placeOrder(userId, groceryItems);

      expect(mockUserService.placeOrder).toHaveBeenCalledWith(userId, groceryItems);
      expect(result).toEqual({ message: 'Order placed successfully' });
    });
  });
});
