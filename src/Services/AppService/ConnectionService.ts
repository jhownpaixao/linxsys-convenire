import { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, GenereateUniqKey, HTTPResponseCode } from '../../Core';
import { logger } from '../Logger';
import { ConnectionModel, ConnectionProfilesModel } from '../Sequelize/Models';
import { InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';
import { ConnectionProfileService } from './ConnectionProfileService';
import { UserService } from './UserService';

export class ConnectionService {
    static async create(data: MakeNullishOptional<InferCreationAttributes<ConnectionModel>>) {
        const register = await ConnectionModel.findOne({
            where: { name: data.name, user_id: data.user_id }
        });
        if (register) throw new AppProcessError('Esta conexão já está em uso', HTTPResponseCode.informationAlreadyExists, 'error');

        try {
            const register = await ConnectionModel.create({
                ...data,
                uniqkey: GenereateUniqKey()
            });
            return register;
        } catch (error) {
            const msg = 'Erro ao cadastrar a conexão';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async delete(id: string | number) {
        const register = await this.get(id);
        await register.destroy();
    }

    static async update(data: MakeNullishOptional<InferCreationAttributes<ConnectionModel>>) {
        const register = await this.get(data.id as number);

        try {
            await register.update(data);
            await register.reload();
            return register;
        } catch (error) {
            const msg = 'Erro ao atualizar a conexão';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async get(id: string | number) {
        const register = await ConnectionModel.findByPk(id);
        if (!register) throw new AppProcessError('A conexão não foi localizada', HTTPResponseCode.informationNotFound);
        return register;
    }

    static async getWith(params: WhereOptions<InferAttributes<ConnectionModel, { omit: never }>>) {
        const register = await ConnectionModel.findOne({
            where: params
        });
        return register;
    }

    static async list() {
        try {
            const list = await ConnectionModel.findAll();
            return list;
        } catch (error) {
            const msg = 'Erro ao buscar a lista de conexões';
            logger.error({ error }, msg);
            throw new Error(msg);
        }
    }

    static async getProfile(id: string | number) {
        const conn = await ConnectionModel.findByPk(id);
        if (!conn) throw new AppProcessError('A conexão não foi localizada', HTTPResponseCode.informationNotFound);
        const profile = await conn.getProfile({
            include: [ConnectionProfilesModel.associations.chatbot]
        });
        return profile;
    }

    static async setProfile(user_id: string | number, conn_id: string | number, profile_id: string | number) {
        const conn = await ConnectionModel.findByPk(conn_id);
        if (!conn) throw new AppProcessError('A conexão não foi localizada', HTTPResponseCode.informationNotFound);

        const profile = await ConnectionProfileService.get(profile_id);

        if (!(await UserService.hasProfile(user_id, profile_id)))
            throw new AppProcessError('O perfil de conexão não pertence à este usuário', HTTPResponseCode.informationBlocked);

        await conn.setProfile(profile);
    }
}