/* eslint-disable no-unused-vars */
import { InferCreationAttributes, Model } from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';

/**
 * Inferface de garantia das propriedades
 * @date 26/03/2023 - 18:22:05
 *
 * @export IService
 * @interface IService
 * @template T
 */
export interface ISequelizeService<T extends Model> {
    /**
     * Model padrão usado para criar o Controller
     * @date 26/03/2023 - 18:22:05
     *
     * @type {ModelType}
     */
    // model: ModelType<T>;

    /**
     * Função básica de criação do model atual
     * @date 26/03/2023 - 18:22:05
     */
    create(data: /* MakeNullishOptional<InferCreationAttributes<T>> */ unknown): Promise<T>;

    /**
     * Função básica de exclusão do model atual
     * @date 26/03/2023 - 18:22:05
     */
    delete(id: string | number): Promise<void>;

    /**
     * Função básica de atualização do model atual
     * @date 26/03/2023 - 18:22:05
     */
    update(data: MakeNullishOptional<InferCreationAttributes<T>>): Promise<T>;

    /**
     * Função básica de retorno do model atual
     * @date 26/03/2023 - 18:22:05
     */
    get(id: string | number): Promise<T>;

    /**
     * Função básica de listagem do model atual
     * @date 26/03/2023 - 18:22:05
     *
     */
    list(): Promise<T[]>;
}
