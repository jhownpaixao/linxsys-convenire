import { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '../../Core';
import { logger } from '../Logger';
import { ChatbotModel } from '../Sequelize/Models';
import { InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';

export class ChatbotService {
    static async create(data: MakeNullishOptional<InferCreationAttributes<ChatbotModel>>) {
        const register = await ChatbotModel.findOne({
            where: { name: data.name, user_id: data.user_id }
        });
        if (register) throw new AppProcessError('Este  chatbot já está cadastrado', HTTPResponseCode.informationAlreadyExists, 'error');

        try {
            const register = await ChatbotModel.create(data);
            return register;
        } catch (error) {
            const msg = 'Erro ao cadastrar o chatbot';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async delete(id: string | number) {
        const register = await this.get(id);
        await register.destroy();
    }

    static async update(data: MakeNullishOptional<InferCreationAttributes<ChatbotModel>>) {
        const register = await this.get(data.id as number);

        try {
            await register.update(data);
            await register.reload();
            return register;
        } catch (error) {
            const msg = 'Erro ao atualizar o chatbot';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async get(id: string | number) {
        const register = await ChatbotModel.findByPk(id);
        if (!register) throw new AppProcessError('O chatbot não foi localizado', HTTPResponseCode.informationNotFound);
        return register;
    }

    static async getWith(params: WhereOptions<InferAttributes<ChatbotModel, { omit: never }>>) {
        const register = await ChatbotModel.findOne({
            where: params
        });
        return register;
    }

    static async list() {
        try {
            const list = await ChatbotModel.findAll();
            return list;
        } catch (error) {
            const msg = 'Erro ao buscar a lista de chatbots';
            logger.error({ error }, msg);
            throw new Error(msg);
        }
    }
}
