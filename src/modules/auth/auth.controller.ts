import { Body, Controller, Get, Post, Request, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "@module/auth/auth.service";
import { LocalAuthGuard } from "@module/auth/guards/local-auth.guard";
import { JwtAuthGuard } from "@module/auth/guards/jwt-auth.guard";
import { RegisterDto } from "@module/auth/dto/register.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('auth/register')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(@Body() body: RegisterDto) {
    return this.authService.register({
      ...body,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
