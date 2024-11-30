import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRegisterDto } from '../dto/admin-register.dto';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { GroceryItemDto } from '../dto/grocery-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  register(@Body() adminRegisterDto: AdminRegisterDto) {
    return this.adminService.register(adminRegisterDto);
  }

  @Post('login')
  login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminService.login(adminLoginDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('grocery')
  addGroceryItem(@Body() groceryItemDto: GroceryItemDto) {
    return this.adminService.addGroceryItem(groceryItemDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('grocery')
  viewGroceryItems() {
    return this.adminService.viewGroceryItems();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('grocery/:id')
  updateGroceryItem(
    @Param('id') id: number,
    @Body() groceryItemDto: GroceryItemDto,
  ) {
    return this.adminService.updateGroceryItem(id, groceryItemDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('grocery/:id')
  deleteGroceryItem(@Param('id') id: number) {
    return this.adminService.deleteGroceryItem(id);
  }
}
