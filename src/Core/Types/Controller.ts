
import { InferAttributes, InferCreationAttributes, DataTypes, Model } from 'sequelize';
import {  /* ModelCtor  */ Repository } from 'sequelize-typescript';
/**
 * Referência de tipo usado para definir o Model
 * @date 26/03/2023 - 18:22:05
 */
export declare type ModelCtor<M extends Model = Model> = Repository<M>;
export type ModelType<T extends Model<InferAttributes<T>, InferCreationAttributes<T>>> = ModelCtor<T>
// Isto é certo?
/* export type ModelStatic = typeof Model & (new (values?: object, options?: BuildOptions) => Model); */