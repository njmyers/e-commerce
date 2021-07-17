import { Order, LineItem } from '../../models';
import { Resolver, Root, FieldResolver } from 'type-graphql';

@Resolver(() => Order)
export class OrderResolver {
  @FieldResolver(() => [LineItem])
  async lineItems(@Root() order: Order): Promise<LineItem[]> {
    if (!order.lineItems.isInitialized()) {
      await order.lineItems.init();
    }

    return await order.lineItems.loadItems();
  }
}
