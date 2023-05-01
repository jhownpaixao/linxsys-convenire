import { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, GenereateUniqKey, HTTPResponseCode } from '../../Core';
import { logger } from '../Logger';
import { ISequelizeService } from '../../Core/Types/Service';
import { UserModel } from '../Sequelize/Models';
import bcrypt from 'bcrypt';
import { InferCreationAttributes } from 'sequelize';

export class UserService implements ISequelizeService<UserModel> {
    public async create(data: Omit<MakeNullishOptional<InferCreationAttributes<UserModel>>, 'uniqkey'>) {
        const user = await UserModel.findOne({
            where: { email: data.email }
        });
        if (user) throw new AppProcessError('Este email já está cadastrado', HTTPResponseCode.informationAlreadyExists, 'warning');

        const hash = await bcrypt.hash(data.pass, 10);

        try {
            const user = await UserModel.create({
                name: data.name,
                uniqkey: GenereateUniqKey(),
                email: data.email,
                pass: hash,
                type: data.type,
                block_with_venc: data.block_with_venc,
                date_venc: data.date_venc,
                params: data.params
            });
            return user;
        } catch (error) {
            logger.error({ data }, 'Erro ao cadastrar o usuário');
            throw new Error('Erro ao cadastrar o usuário');
        }
    }

    public async delete(id: string | number) {
        const user = await UserModel.findOne({
            where: { id }
        });

        if (!user) {
            throw new AppProcessError('O usuário não foi localizado', HTTPResponseCode.informationNotFound);
        }

        await user.destroy();
    }

    public async update(data: MakeNullishOptional<InferCreationAttributes<UserModel>>) {
        const user = await this.get(data.id as number);

        try {
            await user.update(data);
            await user.reload();
            return user;
        } catch (error) {
            logger.error({ data }, 'Erro ao atualizar o usuário');
            throw new Error('Erro ao atualizar o usuário');
        }
    }

    public async get(id: string | number) {
        const user = await UserModel.findByPk(id);
        if (!user) throw new AppProcessError('O usuário não foi localizado', HTTPResponseCode.informationNotFound);
        return user;
    }

    public async list() {
        try {
            const list = await UserModel.findAll();
            return list;
        } catch (error) {
            logger.error('Erro ao buscar a lista de usuários');
            throw new Error('Erro ao buscar a lista de usuários');
        }
    }
}
