import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { GroceryItem } from '../entities/grocery-item.entity';
import { AdminRegisterDto } from '../dto/admin-register.dto';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { GroceryItemDto } from '../dto/grocery-item.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(GroceryItem)
    private groceryItemRepository: Repository<GroceryItem>,
    private jwtService: JwtService,
  ) {}

  async register(adminRegisterDto: AdminRegisterDto) {
    const hashedPassword = await bcrypt.hash(adminRegisterDto.password, 10);
    if (await this.adminRepository.findOneBy({
      username: adminRegisterDto.username,
    })) {
      throw new ConflictException('Admin Already Exist');
    }
    const admin = this.adminRepository.create({
      ...adminRegisterDto,
      password: hashedPassword,
    });
    return this.adminRepository.save(admin);
  }

  async login(adminLoginDto: AdminLoginDto) {
    const admin = await this.adminRepository.findOneBy({
      username: adminLoginDto.username,
    });
    if (
      !admin ||
      !(await bcrypt.compare(adminLoginDto.password, admin.password))
    ) {
      throw new NotFoundException('Invalid credentials');
    }
    const payload = { username: admin.username, role: admin.role };
    const token = this.jwtService.sign(payload);
    return { token, role: admin.role };
  }

  async addGroceryItem(groceryItemDto: GroceryItemDto) {
    const item = this.groceryItemRepository.create(groceryItemDto);
    return this.groceryItemRepository.save(item);
  }

  async viewGroceryItems() {
    return this.groceryItemRepository.find();
  }

  async updateGroceryItem(id: number, groceryItemDto: GroceryItemDto) {
    const item = await this.groceryItemRepository.findOneBy({ id });
    if (!item) throw new NotFoundException('Grocery item not found');
    Object.assign(item, groceryItemDto);
    return this.groceryItemRepository.save(item);
  }

  async deleteGroceryItem(id: number) {
    const result = await this.groceryItemRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Grocery item not found');
    return { message: 'Item removed successfully' };
  }
}
