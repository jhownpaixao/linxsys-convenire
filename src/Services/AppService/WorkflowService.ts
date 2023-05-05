import { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '../../Core';
import { logger } from '../Logger';
import { WorkflowModel } from '../Sequelize/Models';
import { InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';

export class WorkflowService {
    static async create(data: MakeNullishOptional<InferCreationAttributes<WorkflowModel>>) {
        const register = await WorkflowModel.findOne({
            where: { name: data.name, user_id: data.user_id }
        });
        if (register)
            throw new AppProcessError('Este nome de workflow já está cadastrado', HTTPResponseCode.informationAlreadyExists, 'error');

        try {
            const register = await WorkflowModel.create(data);
            return register;
        } catch (error) {
            const msg = 'Erro ao cadastrar o workflow';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async delete(id: string | number) {
        const register = await this.get(id);
        await register.destroy();
    }

    static async update(data: MakeNullishOptional<InferCreationAttributes<WorkflowModel>>) {
        const register = await this.get(data.id as number);

        try {
            await register.update(data);
            await register.reload();
            return register;
        } catch (error) {
            const msg = 'Erro ao atualizar o workflow';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async get(id: string | number) {
        const register = await WorkflowModel.findByPk(id);
        if (!register) throw new AppProcessError('O workflow não foi localizado', HTTPResponseCode.informationNotFound);
        return register;
    }

    static async getWith(params: WhereOptions<InferAttributes<WorkflowModel, { omit: never }>>) {
        const register = await WorkflowModel.findOne({
            where: params
        });
        return register;
    }

    static async list() {
        try {
            const list = await WorkflowModel.findAll();
            return list;
        } catch (error) {
            const msg = 'Erro ao buscar a lista de workflows';
            logger.error({ error }, msg);
            throw new Error(msg);
        }
    }
}
