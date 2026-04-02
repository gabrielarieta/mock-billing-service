import { Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { PaymentsService } from '../payments/payments.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Post()
  async create(
    @Body('number') number: string,
    @Body('amount') amount: number,
    @Body('customerId') customerId: string,
    @Body('issueDate') issueDate: string,
    @Body('dueDate') dueDate: string,
  ) {
    return this.invoicesService.create(number, amount, customerId, issueDate, dueDate);
  }

  @Post(':id/pay')
  async payInvoice(
    @Param('id') invoiceId: string,
    @Body('amount') amount: number,
  ) {
    return this.paymentsService.payInvoice(invoiceId, amount);
  }
}