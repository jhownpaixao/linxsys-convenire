import type { MakeNullishOptional, NullishPropertiesOf } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '@core';
import { logger } from '../Logger';
import { ChatMessageModel, ChatModel } from '../sequelize/Models';
import type { InferAttributes, InferCreationAttributes, Optional, WhereOptions } from 'sequelize';

export class ChatService {
  static async create(data: MakeNullishOptional<InferCreationAttributes<ChatModel>>) {
    try {
      const register = await ChatModel.create(data);
      return register;
    } catch (error) {
      const msg = 'Erro ao criar o chat';
      logger.error({ data, error }, msg);
      throw new Error(msg);
    }
  }

  static async delete(id: string | number) {
    const register = await this.get(id);
    await register.destroy();
  }

  static async update(data: MakeNullishOptional<InferCreationAttributes<ChatModel>>) {
    const register = await this.get(data.id as number);

    try {
      await register.update(data);
      await register.reload();
      return register;
    } catch (error) {
      const msg = 'Erro ao atualizar o chat';
      logger.error({ data, error }, msg);
      throw new Error(msg);
    }
  }

  static async get(id: string | number) {
    const register = await ChatModel.findByPk(id);
    if (!register)
      throw new AppProcessError('O chat não foi localizado', HTTPResponseCode.informationNotFound);
    return register;
  }

  static async getWith(params: WhereOptions<InferAttributes<ChatModel, { omit: never }>>) {
    const register = await ChatModel.findOne({
      where: params
    });
    return register;
  }

  static async list() {
    try {
      const list = await ChatModel.findAll();
      return list;
    } catch (error) {
      const msg = 'Erro ao buscar a lista de chats';
      logger.error({ error }, msg);
      throw new Error(msg);
    }
  }

  static async listMessages(chat_id: string | number) {
    const list = await ChatModel.findByPk(chat_id, {
      include: [ChatModel.associations.messages]
    });

    return list?.messages || [];
  }

  static async getMessage(
    chat_id: string | number,
    params: WhereOptions<InferAttributes<ChatMessageModel, { omit: never }>>
  ) {
    const chat = await this.get(chat_id);
    if (!chat)
      throw new AppProcessError('O chat não foi localizado', HTTPResponseCode.informationNotFound);
    const profiles = await chat.getMessages({
      where: params
    });
    return profiles;
  }

  static async hasMessage(chat_id: string | number, assessment_id: string | number) {
    const chat = await this.get(chat_id);
    const message = await ChatMessageModel.findByPk(assessment_id);
    if (!message)
      throw new AppProcessError(
        'A mensagem não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    return await chat.hasMessage(message);
  }

  static async createMessage(
    chat_id: string | number,
    message_data: Omit<
      Optional<
        InferCreationAttributes<ChatMessageModel, { omit: never }>,
        NullishPropertiesOf<InferCreationAttributes<ChatMessageModel, { omit: never }>>
      >,
      'chat_id'
    >
  ) {
    const chat = await this.get(chat_id);
    const message = await chat.createMessage(message_data);
    return message;
  }

  //!Implementação necessária na remoção da mensagem é exlcuir da DB e remover a associação
  static async deleteMessage(chat_id: string | number, message_id: string | number) {
    /* TODO */
  }
}
