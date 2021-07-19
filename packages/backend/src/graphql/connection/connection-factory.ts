import { Field, ObjectType, Int } from 'type-graphql';
import { ClassType, AbstractClassType } from './types';

import { IEdge } from './edge-factory';
import { IPageInfo } from './page-info-factory';

export interface IConnection<T> {
  totalCount: number;
  edges: IEdge<T>[];
  pageInfo: IPageInfo;
}

export function ConnectionFactory<T>(
  Edge: ClassType<IEdge<T>>,
  PageInfo: ClassType<IPageInfo>
): AbstractClassType<IConnection<T>> {
  @ObjectType({ isAbstract: true, description: 'Pagination connection' })
  abstract class Connection {
    @Field(() => Int)
    totalCount!: number;

    @Field(() => [Edge])
    edges!: IEdge<T>[];

    @Field(() => PageInfo)
    pageInfo!: IPageInfo;
  }

  return Connection;
}
