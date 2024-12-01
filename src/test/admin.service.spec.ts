import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '../admin/admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { GroceryItem } from '../entities/grocery-item.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
jest.mock('bcrypt');
import { NotFoundException } from '@nestjs/common';
const mockAdminRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
};

const mockGroceryItemRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
};
describe('AdminService', () => {
  let service: AdminService;
  let adminRepo: Repository<Admin>;
  let groceryRepo: Repository<GroceryItem>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        JwtService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockAdminRepository,
        },
        {
          provide: getRepositoryToken(GroceryItem),
          useValue: mockGroceryItemRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    adminRepo = module.get<Repository<Admin>>(getRepositoryToken(Admin));
    groceryRepo = module.get<Repository<GroceryItem>>(
      getRepositoryToken(GroceryItem),
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash the password and save the admin', async () => {
      const adminDto = { username: 'testuser', password: 'password123' };
      const hashedPassword = 'MockHashedPassword';

      // Mock bcrypt.hash to return the expected hashed password
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      mockAdminRepository.create.mockReturnValue({
        ...adminDto,
        password: hashedPassword,
      });
      mockAdminRepository.save.mockResolvedValue({
        id: 1,
        ...adminDto,
        password: hashedPassword,
      });

      const result = await service.register(adminDto);

      // Validate that the repository methods are called with the correct data
      expect(mockAdminRepository.create).toHaveBeenCalledWith({
        username: 'testuser',
        password: hashedPassword,
      });
      expect(mockAdminRepository.save).toHaveBeenCalled();

      // Validate the result
      expect(result).toEqual({ id: 1, ...adminDto, password: hashedPassword });
    });
  });
  describe('login', () => {
    it('should validate admin credentials and return JWT token', async () => {
      const adminDto = { username: 'testuser', password: 'password123' };
      const admin = {
        id: 1,
        username: 'testuser',
        password: 'MockHashedPassword',
        role: 'admin',
      };
      const jwtToken = 'mockJwtToken';

      // Mocking repository to return a matching admin
      mockAdminRepository.findOneBy.mockResolvedValue(admin);

      // Mocking bcrypt.compare to return true (passwords match)
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Mocking jwtService.sign to return a mocked JWT token
      jest.spyOn(jwtService, 'sign').mockReturnValue(jwtToken);

      const result = await service.login(adminDto);

      // Expectations
      expect(mockAdminRepository.findOneBy).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        adminDto.password,
        admin.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: admin.username,
        role: admin.role,
      });
      expect(result).toEqual({ token: jwtToken, role: 'admin' });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const adminDto = { username: 'nonexistent', password: 'password123' };

      // Mocking repository to return null (user not found)
      mockAdminRepository.findOneBy.mockResolvedValue(null);

      await expect(service.login(adminDto)).rejects.toThrow(NotFoundException);
      expect(mockAdminRepository.findOneBy).toHaveBeenCalledWith({
        username: 'nonexistent',
      });
    });

    it('should throw NotFoundException if password does not match', async () => {
      const adminDto = { username: 'testuser', password: 'wrongpassword' };
      const admin = {
        id: 1,
        username: 'testuser',
        password: 'MockHashedPassword',
        role: 'admin',
      };

      // Mocking repository to return a matching admin
      mockAdminRepository.findOneBy.mockResolvedValue(admin);

      // Mocking bcrypt.compare to return false (passwords do not match)
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(adminDto)).rejects.toThrow(NotFoundException);
      expect(mockAdminRepository.findOneBy).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        adminDto.password,
        admin.password,
      );
    });
  });

  describe('addGroceryItem', () => {
    it('should save and return the created grocery item', async () => {
      const itemDto = { name: 'Apple', price: 1.5, quantity: 100 };
      mockGroceryItemRepository.create.mockReturnValue(itemDto);
      mockGroceryItemRepository.save.mockResolvedValue({ id: 1, ...itemDto });

      const result = await service.addGroceryItem(itemDto);

      expect(mockGroceryItemRepository.create).toHaveBeenCalledWith(itemDto);
      expect(mockGroceryItemRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...itemDto });
    });
  });
  describe('viewGroceryItems', () => {
    it('should return an array of grocery items', async () => {
      const groceryItems = [
        { id: 1, name: 'Apple', price: 1.5, quantity: 100 },
        { id: 2, name: 'Banana', price: 1.2, quantity: 200 },
      ];
      mockGroceryItemRepository.find.mockResolvedValue(groceryItems);

      const result = await service.viewGroceryItems();

      expect(mockGroceryItemRepository.find).toHaveBeenCalled();
      expect(result).toEqual(groceryItems);
    });
  });
  describe('updateGroceryItem', () => {
    it('should update the grocery item and return it', async () => {
      const groceryItemDto = { name: 'Apple', price: 1.5, quantity: 150 };
      const existingItem = { id: 1, name: 'Apple', price: 1.5, quantity: 100 };
      const updatedItem = { id: 1, ...groceryItemDto };

      mockGroceryItemRepository.findOneBy.mockResolvedValue(existingItem);
      mockGroceryItemRepository.save.mockResolvedValue(updatedItem);

      const result = await service.updateGroceryItem(1, groceryItemDto);

      expect(mockGroceryItemRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
      expect(mockGroceryItemRepository.save).toHaveBeenCalledWith(updatedItem);
      expect(result).toEqual(updatedItem);
    });

    it('should throw NotFoundException if grocery item is not found', async () => {
      const groceryItemDto = { name: 'Apple', price: 1.5, quantity: 150 };

      mockGroceryItemRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateGroceryItem(1, groceryItemDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockGroceryItemRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
    });
  });
  describe('deleteGroceryItem', () => {
    it('should delete the grocery item successfully', async () => {
      const result = { affected: 1 }; // simulate successful deletion
      mockGroceryItemRepository.delete.mockResolvedValue(result);

      const response = await service.deleteGroceryItem(1);

      expect(mockGroceryItemRepository.delete).toHaveBeenCalledWith(1);
      expect(response).toEqual({ message: 'Item removed successfully' });
    });

    it('should throw NotFoundException if grocery item is not found', async () => {
      const result = { affected: 0 }; // simulate failed deletion (item not found)
      mockGroceryItemRepository.delete.mockResolvedValue(result);

      await expect(service.deleteGroceryItem(1)).rejects.toThrow(
        NotFoundException,
      );

      mockGroceryItemRepository.delete.mockResolvedValue(result);
  
      await expect(service.deleteGroceryItem(1)).rejects.toThrow(NotFoundException);
      expect(mockGroceryItemRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
