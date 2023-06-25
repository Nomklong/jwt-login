import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from "@module/auth/enum/roles.enum";

export class AdminUpdateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  roles: Role[]
}
