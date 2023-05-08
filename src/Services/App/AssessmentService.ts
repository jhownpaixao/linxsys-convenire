import { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '@Core';
import { logger } from '../Logger';
import { AssessmentModel } from '../Sequelize/Models';
import { InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';

export class AssessmentService {
    static async create(data: MakeNullishOptional<InferCreationAttributes<AssessmentModel>>) {
        try {
            const register = await AssessmentModel.create(data);
            return register;
        } catch (error) {
            const msg = 'Erro ao cadastrar a avaliação';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async delete(id: string | number) {
        const register = await this.get(id);
        await register.destroy();
    }

    static async update(data: MakeNullishOptional<InferCreationAttributes<AssessmentModel>>) {
        const register = await this.get(data.id as number);

        try {
            await register.update(data);
            await register.reload();
            return register;
        } catch (error) {
            const msg = 'Erro ao atualizar a avaliação';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async get(id: string | number) {
        const register = await AssessmentModel.findByPk(id);
        if (!register) throw new AppProcessError('A avaliação não foi localizada', HTTPResponseCode.informationNotFound);
        return register;
    }

    static async getWith(params: WhereOptions<InferAttributes<AssessmentModel, { omit: never }>>) {
        const register = await AssessmentModel.findOne({
            where: params
        });
        return register;
    }

    static async list() {
        try {
            const list = await AssessmentModel.findAll();
            return list;
        } catch (error) {
            const msg = 'Erro ao buscar a lista da avaliações';
            logger.error({ error }, msg);
            throw new Error(msg);
        }
    }
}
