import type { BuildOptions, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import type { Repository } from 'sequelize-typescript';
/**
 * Referência de tipo usado para definir o Model
 * @date 26/03/2023 - 18:22:05
 */
export type ModelCtor<M extends Model = Model> = Repository<M>;
export type ModelType<M extends Model<InferAttributes<M>, InferCreationAttributes<M>>> =
  ModelCtor<M>;
export type EntityType<M extends Model> = M & AssociationFunctions;
// Isto é certo?
export type ModelStatic<M> = M & (new (values?: object, options?: BuildOptions) => Model);

export interface AssociationFunctions {
  [key: string]: CallableFunction;
}
