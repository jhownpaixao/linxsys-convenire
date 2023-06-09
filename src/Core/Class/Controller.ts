/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import type { MakeNullishOptional } from 'sequelize/types/utils';
import type { ModelType } from '../types';

/**
 * Inferface de garantia das propriedades
 * @date 26/03/2023 - 18:22:05
 *
 * @export IControllerBase
 * @interface IControllerBase
 * @template T
 */
export interface IControllerBase<T extends Model> {
  /**
   * Model padrão usado para criar o Controller
   * @date 26/03/2023 - 18:22:05
   *
   * @type {ModelType}
   */
  Model: ModelType<T>;
  /**
   * Função de retorno do istancimento de Model
   * @date 26/03/2023 - 18:22:05
   *
   */
  ResolveModel(id: string): Promise<false | T>;
  /**
   * Função básica de criação do model atual
   * @date 26/03/2023 - 18:22:05
   */
  Create(data: MakeNullishOptional<InferCreationAttributes<T>>): Promise<T>;

  /**
   * Função básica de listagem do model atual
   * @date 26/03/2023 - 18:22:05
   *
   */
  List(): Promise<T[]>;
}
/**
 * Classe base Abstrata para criação dos controllers
 * @date 26/03/2023 - 18:22:05
 *
 * @export
 * @abstract
 * @class Controller
 * @template T
 * @implements {IControllerBase<T>}
 */
export default abstract class Controller<
  T extends Model<InferAttributes<T>, InferCreationAttributes<T>>
> implements IControllerBase<T>
{
  id: CreationOptional<number>;
  /**
   * Model padrão usado para criar o Controller
   * @date 26/03/2023 - 18:22:05
   *
   * @public
   * @type {ModelStatic}
   */
  public Model: ModelType<T>;
  /**
   * Creates an instance of Controller.
   * @date 26/03/2023 - 18:22:05
   *
   * @constructor
   * @param {*} model
   */
  constructor(model: any) {
    this.Model = model;
  }

  /**
   * Função de retorno do istancimento de Model
   * @date 26/03/2023 - 18:22:05
   *
   * @public
   * @async
   */
  public async ResolveModel(id: string): Promise<false | T> {
    const thisModel = await this.Model.findByPk(id);
    if (!thisModel) return false;
    return thisModel;
  }

  /**
   * Função básica de criação do model atual
   * @date 26/03/2023 - 18:22:05
   *
   * @public
   * @async
   * @param {InferCreationAttributes<T>} data
   */
  public async Create(data: MakeNullishOptional<InferCreationAttributes<T>>): Promise<T> {
    const operation = await this.Model.create(data);
    return operation;
  }

  /**
   * Função básica de listagem do model atual
   * @date 26/03/2023 - 18:22:05
   *
   * @public
   * @async
   * @returns {Promise<Model[]>}
   */
  public async List(): Promise<T[]> {
    const operation = await this.Model.findAll();
    return operation;
  }
}
