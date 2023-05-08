export * from './Controller';
export * from './Responses';
export * from './Connection';
export * from './Omilia';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ObjectWithDynamicKey = {
    [key: string]: unknown;
};
