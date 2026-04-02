import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { OutboxModule } from '../outbox/outbox.module';
import { BillingModule } from '../billing/billing.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PrismaModule, PaymentsModule ,OutboxModule, BillingModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}