import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from "@module/auth/enum/roles.enum";

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;
}
