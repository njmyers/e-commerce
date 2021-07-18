import { Populate } from '@mikro-orm/core';
import { orm } from '../../../lib/orm';
import { ApplicationError, StatusCode, ErrorCode } from '../../../lib/error';
import { Order, OrderFields, LineItemFields, LineItem } from '../models';
import { Customer } from '../../shop/models';

export interface OrderInput extends OrderFields {
  lineItems: LineItemFields[];
  customer: Customer;
}

async function findById(
  id: number,
  populate?: Populate<Order>
): Promise<Order | null> {
  return await orm.em.findOne(Order, { id }, populate);
}

async function findByNumber(
  number: string,
  populate?: Populate<Order>
): Promise<Order | null> {
  return await orm.em.findOne(Order, { number }, populate);
}

function create(input: OrderInput): Order {
  const { lineItems, customer, ...fields } = input;
  const order = new Order(fields);

  if (Array.isArray(lineItems)) {
    lineItems.forEach(lineItem => {
      order.lineItems.add(new LineItem(lineItem));
    });
  }

  if (customer) {
    order.customer = customer;
  }

  orm.em.persist(order);

  return order;
}

async function update(id: number, input: Partial<OrderInput>): Promise<Order> {
  const order = await orm.em.findOne(Order, id);

  if (!order) {
    throw new ApplicationError('Cannot find order with id', {
      status: StatusCode.NotFound,
      code: ErrorCode.ERROR_NOT_FOUND,
      data: {
        id,
      },
    });
  }

  const { lineItems, ...fields } = input;

  if (Array.isArray(lineItems)) {
    lineItems.forEach(lineItem => {
      order.lineItems.add(new LineItem(lineItem));
    });
  }

  Object.entries(fields).forEach(([field, value]) => {
    if (value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      order[field] = value;
    }
  });

  return order;
}

export const orderRepo = {
  findById,
  findByNumber,
  create,
  update,
};
