import { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, Security, HTTPResponseCode } from '@Core';
import { logger } from '../Logger';
import { AttendantModel } from '../Sequelize/Models';
import bcrypt from 'bcrypt';
import { InferCreationAttributes } from 'sequelize';

export class AttendantService {
    static async create(data: Omit<MakeNullishOptional<InferCreationAttributes<AttendantModel>>, 'uniqkey'>) {
        const attendant = await AttendantModel.findOne({
            where: { email: data.email }
        });
        if (attendant) throw new AppProcessError('Este email já está cadastrado', HTTPResponseCode.informationAlreadyExists, 'warning');

        const hash = await bcrypt.hash(data.pass, 10);

        try {
            const attendant = await AttendantModel.create({
                ...data,
                uniqkey: Security.uniqkey(),
                pass: hash
            });
            return attendant;
        } catch (error) {
            const msg = 'Erro ao cadastrar o atendente';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async delete(id: string | number) {
        const attendant = await this.get(id);
        await attendant.destroy();
    }

    static async update(data: MakeNullishOptional<InferCreationAttributes<AttendantModel>>) {
        const user = await this.get(data.id as number);

        try {
            await user.update(data);
            await user.reload();
            return user;
        } catch (error) {
            const msg = 'Erro ao atualizar o atendente';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async get(id: string | number) {
        const user = await AttendantModel.findByPk(id);
        if (!user) throw new AppProcessError('O atendente não foi localizado', HTTPResponseCode.informationNotFound);
        return user;
    }

    static async list() {
        try {
            const list = await AttendantModel.findAll();
            return list;
        } catch (error) {
            const msg = 'Erro ao buscar a lista de atendentes';
            logger.error({ error }, msg);
            throw new Error(msg);
        }
    }
}
