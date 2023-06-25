import { IsEmail, IsNotEmpty } from 'class-validator';

export class UsersUpdateDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  mobile?: string;
  address?: string;
}
