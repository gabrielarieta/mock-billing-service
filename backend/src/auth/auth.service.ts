import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Token } from './interface/token.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    name: string,
    email: string,
    password: string,
  ): Promise<Token> {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    const user = await this.usersService.create(name, email, password);

    return await this.generateTokens(user.id, user.email);
  }

  async signIn(email: string, password: string): Promise<Token> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.generateTokens(user.id, user.email);
  }

  async generateTokens(userId: string, email: string): Promise<Token> {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '1h',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    await this.usersService.updateRefreshToken(userId, refreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshTokens(userId: string): Promise<Token> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token not valid');
    }

    return await this.generateTokens(user.id, user.email);
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }
}