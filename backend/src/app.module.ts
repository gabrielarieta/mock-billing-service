import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
    ClientsModule.register([
      {
        name: 'BILLING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.RABBITMQ_QUEUE || 'billing_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
    UsersModule,
    AuthModule,
    CustomersModule,
    InvoicesModule,
    PaymentsModule,
    OutboxModule,
    BillingModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}