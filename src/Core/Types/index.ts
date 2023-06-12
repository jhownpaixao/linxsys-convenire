import type { InferAttributes, Model, WhereOptions } from 'sequelize';
export * from './Controller';
export * from './Responses';
export * from './Connection';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ObjectWithDynamicKey = {
  [key: string]: unknown;
};

export type WhereParams<M extends Model> = WhereOptions<InferAttributes<M, { omit: never }>>;
