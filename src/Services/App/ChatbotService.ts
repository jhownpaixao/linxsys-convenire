import { MakeNullishOptional, NullishPropertiesOf } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '@core';
import { logger } from '../Logger';
import { ChatbotModel, WorkflowModel } from '../sequelize/models';
import { InferAttributes, InferCreationAttributes, Optional, WhereOptions } from 'sequelize';
import { WorkflowService } from './WorkflowService';
import { UserService } from './UserService';

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

    static async getWorkflow(id: string | number) {
        const chatbot = await this.get(id);
        const workflow = await chatbot.getWorkflow();
        if (!workflow)
            throw new AppProcessError('Este chatbot não possui um workflow vinculado', HTTPResponseCode.informationNotFound, 'warning');
        return workflow;
    }

    static async addWorkflow(
        id: string | number,
        params: Optional<
            InferCreationAttributes<WorkflowModel, { omit: never }>,
            NullishPropertiesOf<InferCreationAttributes<WorkflowModel, { omit: never }>>
        >
    ) {
        const chatbot = await this.get(id);

        try {
            const workflow = await chatbot.createWorkflow({
                ...params,
                user_id: chatbot.user_id
            });

            return workflow;
        } catch (error) {
            const msg = 'Erro ao criar o workflow deste chatbot';
            logger.error({ error }, msg);
            throw new Error(msg);
        }
    }

    static async setWorkflow(user_id: string | number, chatbot_id: string | number, workflow_id: string | number) {
        const chatbot = await this.get(chatbot_id);
        const workflow = await WorkflowService.get(workflow_id);

        if (chatbot.workflow_id == workflow_id)
            throw new AppProcessError(
                'Este chatbot já está vinculado à este workflow',
                HTTPResponseCode.informationAlreadyExists,
                'warning'
            );

        if (!(await UserService.hasWorkflow(user_id, workflow_id)))
            throw new AppProcessError('O workflow não pertence à este usuário', HTTPResponseCode.informationBlocked);

        await chatbot.setWorkflow(workflow);
    }
}
