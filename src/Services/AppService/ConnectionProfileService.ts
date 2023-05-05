import { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '../../Core';
import { logger } from '../Logger';
import { ConnectionProfilesModel } from '../Sequelize/Models';
import { InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';

export class ConnectionProfileService {
    static async create(data: MakeNullishOptional<InferCreationAttributes<ConnectionProfilesModel>>, user_id: string | number) {
        const register = await ConnectionProfilesModel.findOne({
            where: { name: data.name, user_id }
        });
        if (register) throw new AppProcessError('Este nome de perfil já está em uso', HTTPResponseCode.informationAlreadyExists, 'error');

        try {
            data.user_id = parseInt(user_id as string);
            const register = await ConnectionProfilesModel.create(data);
            return register;
        } catch (error) {
            const msg = 'Erro ao cadastrar o perfil';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async delete(id: string | number) {
        const register = await this.get(id);
        await register.destroy();
    }

    static async update(data: MakeNullishOptional<InferCreationAttributes<ConnectionProfilesModel>>) {
        const register = await this.get(data.id as number);

        try {
            await register.update(data);
            await register.reload();
            return register;
        } catch (error) {
            const msg = 'Erro ao atualizar perfil';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async get(id: string | number) {
        const register = await ConnectionProfilesModel.findByPk(id);
        if (!register) throw new AppProcessError('O perfil não foi localizado', HTTPResponseCode.informationNotFound);
        return register;
    }

    static async getWith(params: WhereOptions<InferAttributes<ConnectionProfilesModel, { omit: never }>>) {
        const register = await ConnectionProfilesModel.findOne({
            where: params
        });
        return register;
    }

    static async list() {
        try {
            const list = await ConnectionProfilesModel.findAll();
            return list;
        } catch (error) {
            const msg = 'Erro ao buscar a lista de perfis';
            logger.error({ error }, msg);
            throw new Error(msg);
        }
    }
}
