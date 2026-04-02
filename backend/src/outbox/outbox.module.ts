import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OutboxService } from './outbox.service';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [PrismaModule, BillingModule],
  providers: [OutboxService],
  exports: [OutboxService],
})
export class OutboxModule {}