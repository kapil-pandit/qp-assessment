import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroceryItem } from '../entities/grocery-item.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { OrderItem } from '../entities/order-item.entity';
import { UserLoginDto } from 'src/dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { UserRegisterDto } from 'src/dto/user-register.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(GroceryItem)
    private groceryItemRepository: Repository<GroceryItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async viewGroceryItems() {
    return this.groceryItemRepository.find();
  }
  async placeOrder(userId: number, groceryItems: { itemId: number; quantity: number }[]) {
    console.log(":::: groceryItems :::", groceryItems);
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const order = this.orderRepository.create({ user });
    await this.orderRepository.save(order);
    if (!Array.isArray(groceryItems)) {
      throw new BadRequestException('groceryItems should be an array');
    }

    const orderItems = groceryItems.map((item) => {
      return this.orderItemRepository.create({
        order,
        groceryItem: { id: item.itemId }, // Assuming `id` is enough to fetch the grocery item
        quantity: item.quantity,
      });
    });

    await this.orderItemRepository.save(orderItems);

    return { message: 'Order placed successfully', orderId: order.id };
  }
  async register(userRegisterDto: UserRegisterDto) {
    const { username, password } = userRegisterDto;

    // Check if the username already exists
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return { message: 'User registered successfully' };
  }

  // User login
  async login(userLoginDto: UserLoginDto) {
    const { username, password } = userLoginDto;

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Create JWT token
    const payload = { username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token, role: user.role };
  }
}
