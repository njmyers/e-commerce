import { Field, ObjectType } from 'type-graphql';
import { AbstractClassType } from './types';

export interface IPageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

export function PageInfoFactory(): AbstractClassType<IPageInfo> {
  @ObjectType({ isAbstract: true, description: 'Pagination information' })
  abstract class PageInfo {
    @Field()
    endCursor!: string;

    @Field()
    hasNextPage!: boolean;
  }

  return PageInfo;
}
