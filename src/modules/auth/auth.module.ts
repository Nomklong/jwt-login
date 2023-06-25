import { Module } from '@nestjs/common';
import { AuthAccessToken } from './entities/auth-access-token.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from "@module/auth/strategies/local.strategy";
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from "@module/auth/guards/roles.guard";
import { StorageProvider } from '@provider/storage.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@module/users/users.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Users, AuthAccessToken]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('auth.jwtTokenSecret'),
        signOptions: { expiresIn: config.get('auth.accessTokenExpire') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    StorageProvider,
    RolesGuard,
  ],
})
export class AuthModule {}
