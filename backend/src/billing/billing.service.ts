import { Injectable, Logger } from '@nestjs/common';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  @EventPattern('invoice.created')
  handleInvoiceCreated(data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(
        `New invoice created: ${data.invoice.id} - ${data.invoice.amount}`,
      );
      channel.ack(originalMsg);
    } catch (err) {
      this.logger.error(`Failed to handle invoice.created: ${err}`);
      channel.nack(originalMsg, false, false);
    }
  }

  @EventPattern('invoice.paid')
  handleInvoicePaid(data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(
        `Invoice paid: ${data.invoiceId} - ${data.amount}`,
      );
      channel.ack(originalMsg);
    } catch (err) {
      this.logger.error(`Failed to handle invoice.paid: ${err}`);
      channel.nack(originalMsg, false, false);
    }
  }
}