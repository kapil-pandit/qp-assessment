import { IsString, IsNotEmpty } from 'class-validator';

export class AdminRegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
