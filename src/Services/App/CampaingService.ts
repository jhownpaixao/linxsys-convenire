import { AppProcessError, HTTPResponseCode, WhereParams } from '@core';
import type { InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';
import type { MakeNullishOptional } from 'sequelize/types/utils';
import { logger } from '../Logger';
import { CampaingModel } from '../sequelize/Models';

export class CampaingService {
  static async create(data: MakeNullishOptional<InferCreationAttributes<CampaingModel>>) {
    const register = await CampaingModel.findOne({
      where: { type: data.type, env_id: data.env_id, owner_id: data }
    });
    if (register)
      throw new AppProcessError(
        'Este recurso já está cadastrado',
        HTTPResponseCode.informationAlreadyExists,
        'error'
      );

    try {
      const register = await CampaingModel.create(data);
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

  static async update(data: MakeNullishOptional<InferCreationAttributes<CampaingModel>>) {
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
    const register = await CampaingModel.findByPk(id);
    if (!register)
      throw new AppProcessError(
        'O recurso não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    return register;
  }

  static async getWith(params: WhereOptions<InferAttributes<CampaingModel, { omit: never }>>) {
    const register = await CampaingModel.findOne({
      where: params
    });
    return register;
  }

  static async list() {
    try {
      const list = await CampaingModel.findAll();
      return list;
    } catch (error) {
      const msg = 'Erro ao buscar a lista de recursos';
      logger.error({ error }, msg);
      throw new Error(msg);
    }
  }

  static async listWith(params: WhereParams<CampaingModel>) {
    try {
      const list = await CampaingModel.findAll({
        where: params
      });
      return list;
    } catch (error) {
      logger.error({ error }, 'Erro ao buscar a lista de campanhas');
      throw new Error('Erro ao buscar a lista de campanhas');
    }
  }
}
