import { Collection, QueryOrder } from '@mikro-orm/core';
import { ConnectionInput } from './connection-input';
import { IConnection } from './connection-factory';

export async function resolveConnectionFromCollection<C>(
  input: ConnectionInput,
  collection: Collection<C>
): Promise<IConnection<C>> {
  if (!collection.isInitialized()) {
    await collection.init({
      orderBy: {
        id: QueryOrder.DESC,
      },
    });
  }

  const first = input.first ?? 10;
  const offset = input.after ? getIntegerFromCursor(input.after) : 0;

  const nodes = await collection.matching({
    limit: first,
    offset,
    orderBy: {
      id: QueryOrder.ASC,
    },
  });

  const totalCount = await collection.loadCount();
  const pageCount = first + offset;

  return {
    totalCount,
    pageInfo: {
      endCursor: getCursorFromInteger(pageCount),
      hasNextPage: pageCount < totalCount,
    },
    edges: nodes.map((node, index) => {
      return {
        cursor: getCursorFromInteger(offset + index + 1),
        node,
      };
    }),
  };
}

export function getCursorFromInteger(id: number): string {
  return Buffer.from(String(id)).toString('base64');
}

export function getIntegerFromCursor(base64: string): number {
  return Number(Buffer.from(base64, 'base64'));
}
