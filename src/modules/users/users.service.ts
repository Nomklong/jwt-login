import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from "typeorm";
import { Users } from './users.entity';
import { UserUpdateParams } from "./interface";
import { StorageProvider } from '@provider/storage.provider';
import { Role } from "@module/auth/enum/roles.enum";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly storageProvider: StorageProvider,
  ) {}

  async find(username: string): Promise<Users> {
    const userResult = await this.userRepository.findOneBy({ email: username });

    if (!userResult) {
      throw new NotFoundException('User not found.');
    }

    return userResult;
  }

  async findDuplicate(username: string, exceptId: number) {
    const duplicateUser = await this.userRepository.findOneBy({ email: username, id: Not(exceptId) });

    if (duplicateUser !== null) {
      throw new UnprocessableEntityException('Update user Error. Duplicate email.');
    }
  }

  async update(parameter: UserUpdateParams, req: any): Promise<Users> {
    const userResult = await this.find(req.email);

    if (parameter?.email) {
        await this.findDuplicate(parameter?.email, userResult.id);
    }
    parameter.roles = userResult.roles;

    return await this.updateProfile(parameter, userResult);
  }

  async updateUserProfile(parameter: UserUpdateParams): Promise<Users> {
    const userResult = await this.find(parameter.email);

    return await this.updateProfile(parameter, userResult);
  }

  private async updateProfile(parameter: UserUpdateParams, userResult: Users) {
    if (parameter?.email) {
      await this.findDuplicate(parameter?.email, userResult.id);
    }

    try {
      let url: string | null = null;
      if (parameter.avatar) {
        url = await this.storageProvider.uploadFile(parameter.avatar);
      }

      await this.userRepository.update(
        { id: userResult.id },
        { ...userResult, ...parameter, avatar: url }
      );

      delete userResult.password;

      return {
        ...userResult,
        name: parameter.name,
        email: parameter.email,
        mobile: parameter?.mobile,
        address: parameter?.address,
        avatar: url
      };
    } catch (error) {
      throw new Error("Update user Error. Please try again.");
    }
  }
  async deleteUser(id: number) {
    const userResult = await this.userRepository.findOneBy({ id });

    if (userResult.roles === Role.Admin as unknown as Role[]) {
      throw new UnprocessableEntityException("Can't delete admin");
    }

    await this.userRepository.update({ id }, { is_active: 0 });

    delete userResult.password;

    return {
      ...userResult,
      is_active: false
    };

  }
}
