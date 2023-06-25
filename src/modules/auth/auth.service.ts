import {
  BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { v4 as uuidV4 } from 'uuid';
import { RegisterParams } from "@module/auth/interface";
import { Users } from "@module/users/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthAccessToken } from "@module/auth/entities/auth-access-token.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { encryptPassword } from "@common/helper";
import * as dayjs from "dayjs";
import * as bcrypt from 'bcrypt'
import { Role } from "@module/auth/enum/roles.enum";

interface UserResponse {
  access_token: string;
  id: number;
  name: string;
  email: string;
  avatar: string;
  roles: Role[],
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(AuthAccessToken)
    private authAccessTokenRepository: Repository<AuthAccessToken>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  /**
   * @param params
   */
  async register(params: RegisterParams): Promise<any> {
    const userExist = await this.userRepository.findOneBy({
      email: params.email,
    });

    if (userExist) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Email was already existed.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const userResult: Users = await this.userRepository.save({
        email: params.email,
        name: params.name,
        password: await encryptPassword(params.password),
        mobile: params?.mobile,
        address: params?.address,
      });

      return this.response(userResult);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(user: any): Promise<any> {
    return this.response(user);
  }

  /**
   * @param user
   */
  async response(user: Users): Promise<UserResponse> {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      mobile: user.mobile,
      address: user.address,
      roles: user.roles,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    const { access_token_id: accessToken } =
      await this.authAccessTokenRepository.save({
        access_token_id: uuidV4(),
        user_id: user.id,
        roles: user.roles,
        revoke: false,
        expired_at: dayjs()
          .add(this.config.get<number>('auth.accessTokenExpire'), 'minutes')
          .toDate(),
      });

    return {
      ...payload,
      access_token: this.jwtService.sign({
        jti: accessToken,
      }),
    };
  }

  async validateUser(username: string, password: string): Promise<Users | null> {
    const userResult = await this.userRepository.findOneBy({ email: username });

    if (!userResult) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Username or password mismatch.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!userResult.is_active) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Username is not active.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isCurrent = await bcrypt.compare(password, userResult.password);

    if (!isCurrent) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Username or password mismatch.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return userResult;
  }
}
