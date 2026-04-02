import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard, JwtRefreshAuthGuard } from './auth.guard';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interface/jwtpayload.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto.name, dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const user = req["user"] as JwtPayload;
    return await this.authService.refreshTokens(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = req["user"] as JwtPayload;
    await this.authService.logout(user.sub);
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req["user"];
  }
}