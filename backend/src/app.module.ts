import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { OutboxModule } from './outbox/outbox.module';
import { BillingModule } from './billing/billing.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    BillingModule,
    UsersModule,
    AuthModule,
    CustomersModule,
    InvoicesModule,
    PaymentsModule,
    OutboxModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}