import { NextFunction, Request, Response } from "express";
import { Model, InferAttributes, InferCreationAttributes, BuildOptions } from 'sequelize';

/**
 * Referência de tipo usado para definir o Model
 * @date 26/03/2023 - 18:22:05
 */
export type ModelStatic = typeof Model & { new(values?: object, options?: BuildOptions): Model }

// Isto é certo?
/* export type ModelStatic = typeof Model & (new (values?: object, options?: BuildOptions) => Model); */

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
     * @type {ModelStatic}
     */
    Model: ModelStatic;
    /**
     * Função básica de criação do model atual
     * @date 26/03/2023 - 18:22:05
     *
     * @param {InferCreationAttributes<T>} data
     * @returns {Promise<Model>}
     */
    Create(data: InferCreationAttributes<T>): Promise<Model>;
    /**
     * Função básica de listagem do model atual
     * @date 26/03/2023 - 18:22:05
     *
     * @returns {Promise<Model[]>}
     */
    List(): Promise<Model[]>;
    /**
     * Função básica de exclusão do model atual
     * @date 26/03/2023 - 18:22:05
     *
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<void>}
     */
    Delete(req: Request, res: Response, next: NextFunction): Promise<void>;
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
export default abstract class Controller<T extends Model> implements IControllerBase<T> {
    /**
     * Model padrão usado para criar o Controller
     * @date 26/03/2023 - 18:22:05
     *
     * @public
     * @type {ModelStatic}
     */
    public Model: ModelStatic;
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
     * Função básica de criação do model atual
     * @date 26/03/2023 - 18:22:05
     *
     * @public
     * @async
     * @param {InferCreationAttributes<T>} data
     */
    public async Create(data: InferCreationAttributes<T>): Promise<Model> {
        const operation = await this.Model.create(data);
        return operation;
    }

    /**
     * Função básica de exclusão do model atual
     * @date 26/03/2023 - 18:22:05
     *
     * @public
     * @async
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async Delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = this.Model.destroy({})
    }
    /**
     * Função básica de listagem do model atual
     * @date 26/03/2023 - 18:22:05
     *
     * @public
     * @async
     * @returns {Promise<Model[]>}
     */
    public async List(): Promise<Model[]> {
        const operation = await this.Model.findAll();
        return operation;
    }

}
