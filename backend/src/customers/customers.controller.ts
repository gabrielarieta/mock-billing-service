import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body('name') name: string, @Body('email') email: string) {
    return this.service.create(name, email);
  }
}