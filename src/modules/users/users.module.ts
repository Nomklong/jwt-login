import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Users } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StorageProvider } from '@provider/storage.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, StorageProvider],
  exports: [UsersService],
})
export class UsersModule {}
