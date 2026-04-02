import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy.access';
import { JwtRefreshStrategy } from './strategy.refresh';
import { JwtAuthGuard, JwtRefreshAuthGuard } from './auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    JwtRefreshAuthGuard,
  ],
  exports: [AuthService, JwtAuthGuard, JwtRefreshAuthGuard],
})
export class AuthModule {}