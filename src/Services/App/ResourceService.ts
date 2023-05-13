import type { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '@core';
import { logger } from '../logger';
import { ResourceModel } from '../sequelize/Models';
import type { InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';

export class ResourceService {
  static async create(data: MakeNullishOptional<InferCreationAttributes<ResourceModel>>) {
    const register = await ResourceModel.findOne({
      where: { name: data.name, user_id: data.user_id }
    });
    if (register)
      throw new AppProcessError(
        'Este recurso já está cadastrado',
        HTTPResponseCode.informationAlreadyExists,
        'error'
      );

    try {
      const register = await ResourceModel.create(data);
      return register;
    } catch (error) {
      const msg = 'Erro ao cadastrar o recurso';
      logger.error({ data, error }, msg);
      throw new Error(msg);
    }
  }

  static async delete(id: string | number) {
    const register = await this.get(id);
    await register.destroy();
  }

  static async update(data: MakeNullishOptional<InferCreationAttributes<ResourceModel>>) {
    const register = await this.get(data.id as number);

    try {
      await register.update(data);
      await register.reload();
      return register;
    } catch (error) {
      const msg = 'Erro ao atualizar o recurso';
      logger.error({ data, error }, msg);
      throw new Error(msg);
    }
  }

  static async get(id: string | number) {
    const register = await ResourceModel.findByPk(id);
    if (!register)
      throw new AppProcessError(
        'O recurso não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    return register;
  }

  static async getWith(params: WhereOptions<InferAttributes<ResourceModel, { omit: never }>>) {
    const register = await ResourceModel.findOne({
      where: params
    });
    return register;
  }

  static async list() {
    try {
      const list = await ResourceModel.findAll();
      return list;
    } catch (error) {
      const msg = 'Erro ao buscar a lista de recursos';
      logger.error({ error }, msg);
      throw new Error(msg);
    }
  }
}
