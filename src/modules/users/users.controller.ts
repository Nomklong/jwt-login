import {
  Body,
  Controller, Delete, Param,
  ParseFilePipe, ParseIntPipe,
  Patch,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "@module/auth/guards/jwt-auth.guard";
import { UsersUpdateDto } from "./dto/user-update.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadValidator } from "@validator/file-upload.validator";
import { Roles } from "@module/auth/decolator/roles.decorator";
import { Role } from "@module/auth/enum/roles.enum";
import { RolesGuard } from "@module/auth/guards/roles.guard";
import { AdminUpdateDto } from "@module/users/dto/admin-update.dto";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Request() req: any,
    @Body() body: UsersUpdateDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileUploadValidator({ fileType: 'jpeg,jpg,gif,png' })],
        fileIsRequired: false,
      }),
    )
      file: Express.Multer.File,
  ) {
    return await this.usersService.update({ ...body, avatar: file }, req.user);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update-user-profile')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Body() body: AdminUpdateDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileUploadValidator({ fileType: 'jpeg,jpg,gif,png' })],
        fileIsRequired: false,
      }),
    )
      file: Express.Multer.File,
  ) {
    return await this.usersService.updateUserProfile({ ...body, avatar: file });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/user/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.deleteUser(id);;
  }
}
