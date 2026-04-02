import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('BILLING_SERVICE') private billingClient: ClientProxy,
  ) {}

  async enqueue(eventType: string, payload: any) {
    await this.prisma.outboxEvent.create({
      data: {
        eventType,
        payload,
        processed: false,
      },
    });
  }

  async processPending() {
    const pending = await this.prisma.outboxEvent.findMany({
      where: { processed: false },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    for (const event of pending) {
      try {
        this.billingClient.emit(event.eventType, event.payload).subscribe();
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: { processed: true, processedAt: new Date() },
        });
      } catch (err: any) {
        this.logger.error(
          `Failed to send outbox event ${event.id}: ${err.message}`,
        );
      }
    }
  }
}