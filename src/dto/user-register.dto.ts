import { IsString, IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
