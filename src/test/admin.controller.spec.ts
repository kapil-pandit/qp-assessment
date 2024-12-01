import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../admin/admin.controller';
import { AdminService } from '../admin/admin.service';
import { AdminRegisterDto } from '../dto/admin-register.dto';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { GroceryItemDto } from '../dto/grocery-item.dto';

const mockAdminService = {
  register: jest.fn(),
  login: jest.fn(),
  addGroceryItem: jest.fn(),
  viewGroceryItems: jest.fn(),
  updateGroceryItem: jest.fn(),
  deleteGroceryItem: jest.fn(),
};

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call service.register with correct data', async () => {
      const adminRegisterDto: AdminRegisterDto = {
        username: 'testuser',
        password: 'password123',
      };
      mockAdminService.register.mockResolvedValue({
        id: 1,
        ...adminRegisterDto,
      });

      const result = await controller.register(adminRegisterDto);

      expect(mockAdminService.register).toHaveBeenCalledWith(adminRegisterDto);
      expect(result).toEqual({ id: 1, ...adminRegisterDto });
    });
  });

  describe('login', () => {
    it('should call service.login with correct data', async () => {
      const adminLoginDto: AdminLoginDto = {
        username: 'testuser',
        password: 'password123',
      };
      mockAdminService.login.mockResolvedValue({
        token: 'mockToken',
        role: 'admin',
      });

      const result = await controller.login(adminLoginDto);

      expect(mockAdminService.login).toHaveBeenCalledWith(adminLoginDto);
      expect(result).toEqual({ token: 'mockToken', role: 'admin' });
    });
  });

  describe('addGroceryItem', () => {
    it('should call service.addGroceryItem with correct data', async () => {
      const groceryItemDto: GroceryItemDto = {
        name: 'Apple',
        price: 1.5,
        quantity: 100,
      };
      mockAdminService.addGroceryItem.mockResolvedValue({
        id: 1,
        ...groceryItemDto,
      });

      const result = await controller.addGroceryItem(groceryItemDto);

      expect(mockAdminService.addGroceryItem).toHaveBeenCalledWith(
        groceryItemDto,
      );
      expect(result).toEqual({ id: 1, ...groceryItemDto });
    });
  });
  describe('viewGroceryItems', () => {
    it('should call service.viewGroceryItems and return the result', async () => {
      const groceryItems = [
        { id: 1, name: 'Apple', price: 1.5, quantity: 100 },
        { id: 2, name: 'Banana', price: 0.5, quantity: 200 },
      ];

      // Mocking the service response
      mockAdminService.viewGroceryItems = jest.fn().mockResolvedValue(groceryItems);

      const result = await controller.viewGroceryItems();

      // Ensure the service method was called
      expect(mockAdminService.viewGroceryItems).toHaveBeenCalled();

      // Validate the returned result
      expect(result).toEqual(groceryItems);
    });
  });
  describe('updateGroceryItem', () => {
    it('should call service.updateGroceryItem with correct data', async () => {
      const id = 1;
      const groceryItemDto: GroceryItemDto = {
        name: 'Updated Apple',
        price: 2.0,
        quantity: 50,
      };

      const mockResponse = {
        id,
        ...groceryItemDto,
      };

      mockAdminService.updateGroceryItem = jest.fn().mockResolvedValue(mockResponse);

      const result = await controller.updateGroceryItem(id, groceryItemDto);

      expect(mockAdminService.updateGroceryItem).toHaveBeenCalledWith(
        id,
        groceryItemDto,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteGroceryItem', () => {
    it('should call service.deleteGroceryItem with correct id', async () => {
      const id = 1;
      const mockResponse = { message: 'Item deleted successfully' };

      mockAdminService.deleteGroceryItem = jest.fn().mockResolvedValue(mockResponse);

      const result = await controller.deleteGroceryItem(id);

      expect(mockAdminService.deleteGroceryItem).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResponse);
    });
  });
});
