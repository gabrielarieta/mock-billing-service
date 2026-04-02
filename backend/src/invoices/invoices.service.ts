import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { Invoice } from '@prisma/client';
import { OutboxService } from '../outbox/outbox.service';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private outboxService: OutboxService,
    @Inject('BILLING_SERVICE') private billingClient: ClientProxy,
  ) {}

  findAll(): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      include: { customer: true, payments: true },
    });
  }

  async create(
    number: string,
    amount: number,
    customerId: string,
    issueDate: string,
    dueDate: string,
  ): Promise<Invoice> {
    const invoice = await this.prisma.$transaction(async (tx: any) => {
      const customer = await tx.customer.findUnique({
        where: { id: customerId },
      });
      if (!customer) {
        throw new Error('Customer not found');
      }

      const inv = await tx.invoice.create({
        data: {
          number,
          amount,
          issueDate,
          dueDate,
          status: 'PENDING',
          customer: { connect: { id: customerId } },
        },
      });

      await tx.outboxEvent.create({
        data: {
          eventType: 'invoice.created',
          payload: {
            invoice: {
              id: inv.id,
              number: inv.number,
              amount: inv.amount,
              customerId: customer.id,
              customerName: customer.name,
              customerEmail: customer.email,
              issueDate: inv.issueDate,
              dueDate: inv.dueDate,
              status: inv.status,
            },
          },
          processed: false,
        },
      });

      return inv;
    });

    await this.outboxService.processPending();

    const event = {
      type: 'invoice.created',
      invoice: {
        id: invoice.id,
        number: invoice.number,
        amount: invoice.amount,
        customerId: invoice.customerId,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
      },
    };

    this.billingClient.emit('invoice.created', event).subscribe();

    return invoice;
  }
}