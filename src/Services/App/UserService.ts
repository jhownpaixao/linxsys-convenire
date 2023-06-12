import type { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, Security, HTTPResponseCode } from '@core';
import { logger } from '../Logger';
import { UserModel } from '../sequelize/Models';
import bcrypt from 'bcrypt';
import type { InferAttributes, InferCreationAttributes, Model, WhereOptions } from 'sequelize';
import { Entity } from '@core/class/Entity';
import { FileService } from './FileService';

type WhereParams<M extends Model> = WhereOptions<InferAttributes<M, { omit: never }>>;

export class UserService extends Entity {
  // !Static Props
  protected model = UserModel;

  /**
   * !Static Methods
   * ?Basic Methods
   */
  static async create(
    data: Omit<MakeNullishOptional<InferCreationAttributes<UserModel>>, 'uniqkey'>
  ) {
    const user = await UserModel.findOne({
      where: { email: data.email }
    });
    if (user)
      throw new AppProcessError(
        'Este email já está cadastrado',
        HTTPResponseCode.informationAlreadyExists,
        'warning'
      );

    const hash = await bcrypt.hash(data.pass, 10);

    try {
      const user = await UserModel.create({
        name: data.name,
        uniqkey: Security.uniqkey(),
        email: data.email,
        picture: data.picture,
        env_id: data.env_id,
        pass: hash,
        type: data.type,
        block_with_venc: data.block_with_venc,
        date_venc: data.date_venc,
        params: data.params
      });

      if (data.picture) FileService.save(data.picture, 'image');

      return user;
    } catch (error) {
      logger.error({ data, error }, 'Erro ao cadastrar o usuário');
      throw new Error('Erro ao cadastrar o usuário');
    }
  }

  static async delete(id: string | number) {
    const user = await this.get(id);
    if (!user) {
      throw new AppProcessError(
        'O usuário não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    }
    try {
      await user.destroy();
      return;
    } catch (error) {
      logger.error({ id, error }, 'Erro ao excluír o usuário');
      throw new Error('Erro ao atualizar o usuário');
    }
  }

  static async update(
    id: string | number,
    data: MakeNullishOptional<InferCreationAttributes<UserModel>>
  ) {
    const user = await this.get(id);
    let password = {};
    if (data.pass) {
      const hash = await bcrypt.hash(data.pass, 10);
      password = {
        pass: hash
      };
    }
    try {
      const picture = user.picture;
      await user.update({
        ...data,
        ...password
      });
      await user.reload();
      if (data.picture && data.picture != picture) {
        FileService.save(data.picture, 'image');
        FileService.delete(picture, 'image');
      }
      return user;
    } catch (error) {
      logger.error({ data, error }, 'Erro ao atualizar o usuário');
      throw new Error('Erro ao atualizar o usuário');
    }
  }

  static async get(id: string | number) {
    const user = await UserModel.findByPk(id, {
      include: [UserModel.associations.environment]
    });
    if (!user)
      throw new AppProcessError(
        'O usuário não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    return user;
  }

  static async getWith(params: WhereParams<UserModel>) {
    const register = await UserModel.findOne({
      where: params,
      include: [UserModel.associations.environment]
    });
    return register;
  }

  static async getWithFullData(params: WhereParams<UserModel>) {
    const register = await UserModel.scope('fullData').findOne({ where: params });
    return register;
  }

  static async list() {
    try {
      const list = await UserModel.findAll({ include: [UserModel.associations.environment] });
      return list;
    } catch (error) {
      logger.error({ error }, 'Erro ao buscar a lista de usuários');
      throw new Error('Erro ao buscar a lista de usuários');
    }
  }

  static async listWith(params: WhereParams<UserModel>) {
    try {
      const list = await UserModel.findAll({
        where: params,
        include: [UserModel.associations.environment]
      });
      return list;
    } catch (error) {
      logger.error({ error }, 'Erro ao buscar a lista de usuários');
      throw new Error('Erro ao buscar a lista de usuários');
    }
  }
}
