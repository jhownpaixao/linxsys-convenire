import { ModelCtor, ModelType, WhereParams } from '@core/types';
import { InferAttributes, InferCreationAttributes, Model, WhereOptions } from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '..';
import { logger } from '../../services/Logger';

/**
 * What is the class's single responsibility?
 * @remarks
 *
 * When should use use the class? What performance benefits, functionality, or other magical power does it confer upon you?
 *
 * * When shouldn't you use the class?
 *
 * * What states does this class furnish?
 *
 * * What behaviors does this class furnish?
 *
 * * Can you inject dependencies into this class?
 *
 * * Are there any situations where it makes sense to extend this class, rather than inject dependencies into it?
 *
 * * How does the code in this class work?
 *
 * @example
 * ```typescript
 *    //example of how to use this class here
 * ```
 *
 * @alpha @beta @eventProperty @experimental @internal @override @packageDocumentation @public @readonly @sealed @virtual
 */

export class ModelService<M extends Model<InferAttributes<M>, InferCreationAttributes<M>>> {
  // !Private (and/or readonly) Properties
  public model: ModelType<M>;
  public staticModel: ModelCtor<M>;
  // !Constructor Function
  //constructor() {}
  // !Getters and Setters
  async delete(id: string | number) {
    const register = await this.get(id);
    await register.destroy();
  }

  async get(id: string | number) {
    const register = await this.model.findByPk(id);

    if (!register)
      throw new AppProcessError(
        'o registro não foi encontrado',
        HTTPResponseCode.informationNotFound
      );
    return register;
  }

  async getWith(params: WhereOptions<InferAttributes<M, { omit: never }>>) {
    const register = await this.model.findOne({
      where: params
    });
    return register;
  }

  async update(data: MakeNullishOptional<InferCreationAttributes<M>> & { id: number }) {
    const register = await this.get(data.id);

    try {
      await register.update(data);
      await register.reload();
      return register;
    } catch (error) {
      const msg = 'Erro ao atualizar a campanha';
      logger.error({ data, error }, msg);
      throw new Error(msg);
    }
  }

  async list() {
    try {
      const list = await this.model.findAll();
      return list;
    } catch (error) {
      const msg = 'Erro ao buscar a lista de recursos';
      logger.error({ error }, msg);
      throw new Error(msg);
    }
  }

  async listWith(params: WhereParams<M>) {
    try {
      const list = await this.model.findAll({
        where: params,
        include: [this.model.associations.environment]
      });
      return list;
    } catch (error) {
      logger.error({ error }, 'Erro ao buscar a lista de registros');
      throw new Error('Erro ao buscar a lista de usuários');
    }
  }
}
