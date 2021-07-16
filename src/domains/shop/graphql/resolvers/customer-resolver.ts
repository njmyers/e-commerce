import { Resolver, Root, Args, FieldResolver } from 'type-graphql';

import { Order, OrderConnection } from '../../../billing/models/order';
import { Customer } from '../../models';
import {
  ConnectionInput,
  IConnection,
  resolveConnectionFromCollection,
} from '../../../../lib/graphql';

@Resolver(() => Customer)
export class CustomerResolver {
  @FieldResolver(() => OrderConnection)
  async orders(
    @Args() input: ConnectionInput,
    @Root() customer: Customer
  ): Promise<IConnection<Order>> {
    return await resolveConnectionFromCollection(input, customer.orders);
  }
}
