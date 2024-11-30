import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroceryItem } from '../entities/grocery-item.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockGroceryItemRepository = {
    find: jest.fn(),
  };
  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockOrderItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(GroceryItem), useValue: mockGroceryItemRepository },
        { provide: getRepositoryToken(Order), useValue: mockOrderRepository },
        { provide: getRepositoryToken(OrderItem), useValue: mockOrderItemRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for viewGroceryItems
  describe('viewGroceryItems', () => {
    it('should return a list of grocery items', async () => {
      const groceryItems = [
        { id: 1, name: 'Apple', price: 100 },
        { id: 2, name: 'Banana', price: 50 },
      ];
      mockGroceryItemRepository.find.mockResolvedValue(groceryItems);

      const result = await userService.viewGroceryItems();

      expect(mockGroceryItemRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(groceryItems);
    });
  });

  // Test for placeOrder
  describe('placeOrder', () => {
    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        userService.placeOrder(1, [{ itemId: 1, quantity: 2 }]),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if groceryItems is not an array', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(userService.placeOrder(1, null)).rejects.toThrow(BadRequestException);
    });

    it('should place an order and return order details', async () => {
      const user = { id: 1 };
      const order = { id: 1 };
      const orderItems = [{ id: 1 }, { id: 2 }];

      mockUserRepository.findOne.mockResolvedValue(user);
      mockOrderRepository.create.mockReturnValue(order);
      mockOrderRepository.save.mockResolvedValue(order);
      mockOrderItemRepository.create.mockReturnValue(orderItems);
      mockOrderItemRepository.save.mockResolvedValue(orderItems);

      const result = await userService.placeOrder(1, [
        { itemId: 1, quantity: 2 },
        { itemId: 2, quantity: 3 },
      ]);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockOrderRepository.create).toHaveBeenCalledWith({ user });
      expect(mockOrderRepository.save).toHaveBeenCalledWith(order);
      expect(mockOrderItemRepository.save).toHaveBeenCalledWith(orderItems);
      expect(result).toEqual({ message: 'Order placed successfully', orderId: order.id });
    });
  });

  // Test for register
  describe('register', () => {
    it('should throw BadRequestException if username already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ username: 'testuser' });

      await expect(
        userService.register({ username: 'testuser', password: 'password123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should register a user successfully', async () => {
      const user = { username: 'testuser', password: 'hashedpassword' };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');

      const result = await userService.register({ username: 'testuser', password: 'password123' });

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'hashedpassword',
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual({ message: 'User registered successfully' });
    });
  });

  // Test for login
  describe('login', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        userService.login({ username: 'testuser', password: 'password123' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid credentials', async () => {
      mockUserRepository.findOne.mockResolvedValue({ username: 'testuser', password: 'hashedpassword' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        userService.login({ username: 'testuser', password: 'wrongpassword' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return a token and role on successful login', async () => {
      const user = { username: 'testuser', password: 'hashedpassword', role: 'user' };
      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await userService.login({ username: 'testuser', password: 'password123' });

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ username: 'testuser', role: 'user' });
      expect(result).toEqual({ token: 'jwt-token', role: 'user' });
    });
  });
});
