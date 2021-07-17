import { ClassType as TypeGraphQLClassType } from 'type-graphql';

export type AbstractClassType<T> = abstract new (...args: unknown[]) => T;
export type ClassType<T> = TypeGraphQLClassType<T>;
export type NodeType<T> = () => ClassType<T>;
