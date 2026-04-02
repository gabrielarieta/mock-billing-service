import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany();
  }

  create(name: string, email: string): Promise<Customer> {
    return this.prisma.customer.create({ data: { name, email } });
  }
}