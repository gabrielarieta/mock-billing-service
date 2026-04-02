import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BillingService } from './billing.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BILLING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
          queue: process.env.RABBITMQ_QUEUE || 'billing_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}