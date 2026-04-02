import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { BillingModule } from '../billing/billing.module';
import { OutboxModule } from '../outbox/outbox.module';

@Module({
  imports: [PrismaModule, OutboxModule ,BillingModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}