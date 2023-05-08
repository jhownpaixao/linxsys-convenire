import { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '@core';
import { logger } from '../logger';
import { ContactModel } from '../sequelize/models';
import { InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';

export class ContactService {
    static async create(data: MakeNullishOptional<InferCreationAttributes<ContactModel>>) {
        const register = await ContactModel.findOne({
            where: { value: data.value, user_id: data.user_id }
        });
        if (register) throw new AppProcessError('Este  contato já está em uso', HTTPResponseCode.informationAlreadyExists, 'error');

        try {
            const register = await ContactModel.create(data);
            return register;
        } catch (error) {
            const msg = 'Erro ao cadastrar o contato';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async delete(id: string | number) {
        const register = await this.get(id);
        await register.destroy();
    }

    static async update(data: MakeNullishOptional<InferCreationAttributes<ContactModel>>) {
        const register = await this.get(data.id as number);

        try {
            await register.update(data);
            await register.reload();
            return register;
        } catch (error) {
            const msg = 'Erro ao atualizar o atendente';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async get(id: string | number) {
        const register = await ContactModel.findByPk(id);
        if (!register) throw new AppProcessError('O contato não foi localizado', HTTPResponseCode.informationNotFound);
        return register;
    }

    static async getWith(params: WhereOptions<InferAttributes<ContactModel, { omit: never }>>) {
        const register = await ContactModel.findOne({
            where: params
        });
        return register;
    }

    static async list() {
        try {
            const list = await ContactModel.findAll();
            return list;
        } catch (error) {
            const msg = 'Erro ao buscar a lista de atendentes';
            logger.error({ error }, msg);
            throw new Error(msg);
        }
    }
}
