import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { OutboxModule } from '../outbox/outbox.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [PrismaModule, OutboxModule, BillingModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}