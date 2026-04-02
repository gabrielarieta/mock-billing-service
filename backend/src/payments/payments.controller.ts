import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(
    private readonly service: PaymentsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('pay/:id')
  async payInvoice(
    @Body('amount') amount: number,
    @Body('id') id: string,
  ) {
    return this.service.payInvoice(id, amount);
  }

  @Get()
  async findAll() {
    return this.prisma.payment.findMany({
      include: { invoice: { include: { customer: true } } },
    });
  }
}