import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from 'src/dto/user-register.dto';
import { UserLoginDto } from 'src/dto/user-login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Register route
  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return this.userService.register(userRegisterDto);
  }

  // Login route
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.userService.login(userLoginDto);
  }

  @Get('grocery-items')
  async viewGroceryItems() {
    return this.userService.viewGroceryItems();
  }
  @Post('place-order/:userId')
  async placeOrder(
    @Param('userId') userId: number,
    @Body() groceryItems: { itemId: number; quantity: number }[],
  ) {
    return this.userService.placeOrder(userId, groceryItems);
  }
}
