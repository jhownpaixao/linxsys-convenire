import { MakeNullishOptional, NullishPropertiesOf } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '@core';
import { logger } from '../logger';
import { ChatbotModel, ConnectionProfilesModel } from '../sequelize/models';
import { InferAttributes, InferCreationAttributes, Optional, WhereOptions } from 'sequelize';
import { ChatbotService } from './ChatbotService';
import { UserService } from './UserService';

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

    static async getChatbot(id: string | number) {
        const profile = await this.get(id);
        const chatbot = await profile.getChatbot();
        if (!chatbot)
            throw new AppProcessError('Este perfil não possui um chatbot vinculado', HTTPResponseCode.informationNotFound, 'warning');
        return chatbot;
    }

    static async addChatbot(
        id: string | number,
        params: Optional<
            InferCreationAttributes<ChatbotModel, { omit: never }>,
            NullishPropertiesOf<InferCreationAttributes<ChatbotModel, { omit: never }>>
        >
    ) {
        const profile = await this.get(id);

        try {
            const chatbot = await profile.createChatbot({
                ...params,
                user_id: profile.user_id
            });

            return chatbot;
        } catch (error) {
            const msg = 'Erro ao criar o chatbot de conexão';
            logger.error({ error }, msg);
            throw new Error(msg);
        }
    }

    static async setChatbot(user_id: string | number, profile_id: string | number, chatbot_id: string | number) {
        const profile = await this.get(profile_id);
        const chatbot = await ChatbotService.get(profile_id);

        if (profile.chatbot_id == chatbot_id)
            throw new AppProcessError('Este chatbot já está vinculado à este perfil', HTTPResponseCode.informationAlreadyExists, 'warning');

        if (!(await UserService.hasChatbot(user_id, chatbot_id)))
            throw new AppProcessError('O perfil de conexão não pertence à este usuário', HTTPResponseCode.informationBlocked);

        await profile.setChatbot(chatbot);
    }
}
