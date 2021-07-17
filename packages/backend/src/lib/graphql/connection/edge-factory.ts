import { Field, ObjectType, ID } from 'type-graphql';
import { NodeType, AbstractClassType } from './types';

export interface IEdge<T> {
  node: T;
  cursor: string;
}

export function EdgeFactory<T>(Node: NodeType<T>): AbstractClassType<IEdge<T>> {
  @ObjectType({ isAbstract: true, description: 'Pagination edge' })
  abstract class Edge {
    @Field(Node)
    node!: T;

    @Field(() => ID)
    cursor!: string;
  }

  return Edge;
}
