import { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, HTTPResponseCode } from '../../Core';
import { logger } from '../Logger';
import { CustomerModel } from '../Sequelize/Models';
import { InferCreationAttributes, Op } from 'sequelize';
import { ContactService } from './ContactService';
import { UserService } from './UserService';

export type CustomerCreationProps = {
    nome: string;
    nascimento: string;
    email: string;
    cpf: string;
    contato: string;
    rg: string;
    cep: string;
    end: string;
    end_num: string;
    bairro: string;
    cidade: string;
    uf: string;
    group_id: string;
    params: object;
    user_id: string;
};
export class CustomerService {
    static async create(data: CustomerCreationProps) {
        const { rg, cpf, email, user_id } = data;
        const user = await UserService.get(user_id);
        if (!user) throw new AppProcessError('O usuário não foi localizado', HTTPResponseCode.informationNotFound);

        const conditions = [];
        if (rg) conditions.push({ rg });
        if (cpf) conditions.push({ cpf });
        if (email) conditions.push({ email });
        if (conditions.length > 0) {
            const client = await user.getClients({
                where: {
                    [Op.and]: [
                        { user_id },
                        {
                            [Op.or]: conditions
                        }
                    ]
                }
            });

            if (client[0]) throw new AppProcessError('Este cliente já está cadastrado', HTTPResponseCode.informationAlreadyExists);
        }

        const contact = await ContactService.getWith({
            value: data.contato
        });
        if (contact) throw new AppProcessError('Este contato está em uso', HTTPResponseCode.informationAlreadyExists);

        try {
            const client = await CustomerModel.create({
                ...data,
                user_id: parseInt(data.user_id),
                group_id: parseInt(data.group_id)
            });

            await ContactService.create({
                value: data.contato,
                user_id: parseInt(data.user_id),
                client_id: client.id
            });
            return client;
        } catch (error) {
            const msg = 'Erro ao cadastrar o cliente';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async delete(id: string | number) {
        const client = await CustomerModel.findOne({
            where: { id }
        });

        if (!client) {
            throw new AppProcessError('O cliente não foi localizado', HTTPResponseCode.informationNotFound);
        }

        await client.destroy();
    }

    static async update(data: MakeNullishOptional<InferCreationAttributes<CustomerModel>>) {
        const register = await this.get(data.id as number);

        try {
            await register.update(data);
            await register.reload();
            return register;
        } catch (error) {
            const msg = 'Erro ao atualizar o cliente';
            logger.error({ data, error }, msg);
            throw new Error(msg);
        }
    }

    static async get(id: string | number) {
        const user = await CustomerModel.findByPk(id);
        if (!user) throw new AppProcessError('O cliente não foi localizado', HTTPResponseCode.informationNotFound);
        return user;
    }

    static async list() {
        try {
            const list = await CustomerModel.findAll();
            return list;
        } catch (error) {
            const msg = 'Erro ao buscar a lista de clientes';
            logger.error({ error }, msg);
            throw new Error(msg);
        }
    }

    static async listContacts(id: string | number) {
        const list = await CustomerModel.findByPk(id, {
            include: [CustomerModel.associations.contacts]
        });

        return list?.contacts || [];
    }
}
