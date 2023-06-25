import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { AuthAccessToken } from '../entities/auth-access-token.entity';
import { JwtPayload } from '../interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    @InjectRepository(AuthAccessToken)
    private authAccessRepository: Repository<AuthAccessToken>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.get('auth.jwtTokenSecret'),
    });
  }

  async validate(payload: JwtPayload) {
    const authAccess = await this.authAccessRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        access_token_id: payload.jti,
        expired_at: MoreThan(new Date()),
      },
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          roles: true,
          created_at: true,
          updated_at: true,
        },
      },
    });

    if (!authAccess) {
      throw new UnauthorizedException();
    }

    return authAccess.user;
  }
}
