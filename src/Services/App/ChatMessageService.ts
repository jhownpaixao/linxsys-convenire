import type { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '@core';
import { logger } from '../logger';
import { ChatMessageModel } from '../sequelize/Models';
import type { InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';

export class ChatMessageService {
  static async create(data: MakeNullishOptional<InferCreationAttributes<ChatMessageModel>>) {
    try {
      const register = await ChatMessageModel.create(data);
      return register;
    } catch (error) {
      const msg = 'Erro ao cadastrar a mensagem';
      logger.error({ data, error }, msg);
      throw new Error(msg);
    }
  }

  static async delete(id: string | number) {
    const register = await this.get(id);
    await register.destroy();
  }

  static async update(data: MakeNullishOptional<InferCreationAttributes<ChatMessageModel>>) {
    const register = await this.get(data.id as number);

    try {
      await register.update(data);
      await register.reload();
      return register;
    } catch (error) {
      const msg = 'Erro ao atualizar a mensagem';
      logger.error({ data, error }, msg);
      throw new Error(msg);
    }
  }

  static async get(id: string | number) {
    const register = await ChatMessageModel.findByPk(id);
    if (!register)
      throw new AppProcessError(
        'A mensagem não foi localizada',
        HTTPResponseCode.informationNotFound
      );
    return register;
  }

  static async getWith(params: WhereOptions<InferAttributes<ChatMessageModel, { omit: never }>>) {
    const register = await ChatMessageModel.findOne({
      where: params
    });
    return register;
  }

  static async list() {
    try {
      const list = await ChatMessageModel.findAll();
      return list;
    } catch (error) {
      const msg = 'Erro ao buscar a lista da mensagens';
      logger.error({ error }, msg);
      throw new Error(msg);
    }
  }
}
