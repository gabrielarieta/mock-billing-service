import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { Payment } from '@prisma/client';
import { OutboxService } from '../outbox/outbox.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private outboxService: OutboxService,
    @Inject('BILLING_SERVICE') private billingClient: ClientProxy,
  ) {}

  async payInvoice(invoiceId: string, amount: number): Promise<Payment> {
    const payment = await this.prisma.$transaction(async (tx: any) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId },
        include: { customer: true },
      });

      if (!invoice) {
        throw new Error('Invoice not found');
      }
      if (invoice.status === 'PAID') {
        throw new Error('Invoice already paid');
      }

      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: 'PAID' },
      });

      const pay = await tx.payment.create({
        data: {
          amount,
          paymentDate: new Date().toISOString().split('T')[0],
          invoice: { connect: { id: invoiceId } },
        },
      });

      await tx.outboxEvent.create({
        data: {
          eventType: 'invoice.paid',
          payload: {
            invoiceId: invoice.id,
            amount: pay.amount,
            paymentDate: pay.paymentDate,
            customer: {
              id: invoice.customer.id,
              name: invoice.customer.name,
              email: invoice.customer.email,
            },
          },
          processed: false,
        },
      });

      return pay;
    });

    await this.outboxService.processPending();

    const event = {
      type: 'invoice.paid',
      invoiceId,
      amount,
      paymentDate: payment.paymentDate,
    };

    this.billingClient.emit('invoice.paid', event).subscribe();

    return payment;
  }
}