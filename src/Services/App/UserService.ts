import { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, Security, HTTPResponseCode } from '@Core';
import { logger } from '../Logger';
import {
    AttendantModel,
    ChatbotModel,
    ConnectionModel,
    ConnectionProfilesModel,
    ContactModel,
    CustomerModel,
    UserModel
} from '../Sequelize/Models';
import bcrypt from 'bcrypt';
import { InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';

export class UserService {
    static async create(data: Omit<MakeNullishOptional<InferCreationAttributes<UserModel>>, 'uniqkey'>) {
        const user = await UserModel.findOne({
            where: { email: data.email }
        });
        if (user) throw new AppProcessError('Este email já está cadastrado', HTTPResponseCode.informationAlreadyExists, 'warning');

        const hash = await bcrypt.hash(data.pass, 10);

        try {
            const user = await UserModel.create({
                name: data.name,
                uniqkey: Security.uniqkey(),
                email: data.email,
                pass: hash,
                type: data.type,
                block_with_venc: data.block_with_venc,
                date_venc: data.date_venc,
                params: data.params
            });
            return user;
        } catch (error) {
            logger.error({ data, error }, 'Erro ao cadastrar o usuário');
            throw new Error('Erro ao cadastrar o usuário');
        }
    }

    static async delete(id: string | number) {
        const user = await this.get(id);
        if (!user) {
            throw new AppProcessError('O usuário não foi localizado', HTTPResponseCode.informationNotFound);
        }
        try {
            await user.destroy();
            return;
        } catch (error) {
            logger.error({ id, error }, 'Erro ao excluír o usuário');
            throw new Error('Erro ao atualizar o usuário');
        }
    }

    static async update(id: string | number, data: MakeNullishOptional<InferCreationAttributes<UserModel>>) {
        const user = await this.get(id);
        const hash = await bcrypt.hash(data.pass, 10);

        try {
            await user.update({
                ...data,
                pass: hash
            });
            await user.reload();
            return user;
        } catch (error) {
            logger.error({ data, error }, 'Erro ao atualizar o usuário');
            throw new Error('Erro ao atualizar o usuário');
        }
    }

    static async get(id: string | number) {
        const user = await UserModel.findByPk(id);
        if (!user) throw new AppProcessError('O usuário não foi localizado', HTTPResponseCode.informationNotFound);
        return user;
    }

    static async getWith(params: WhereOptions<InferAttributes<UserModel, { omit: never }>>) {
        const register = await UserModel.findOne({
            where: params
        });
        return register;
    }

    static async getWithFullData(params: WhereOptions<InferAttributes<UserModel, { omit: never }>>) {
        const register = await UserModel.scope('fullData').findOne({ where: params });
        return register;
    }

    static async list() {
        try {
            const list = await UserModel.findAll();
            return list;
        } catch (error) {
            logger.error({ error }, 'Erro ao buscar a lista de usuários');
            throw new Error('Erro ao buscar a lista de usuários');
        }
    }
    /* SubItens */
    static async listAttendants(id: string | number) {
        const list = await UserModel.findByPk(id, {
            include: [UserModel.associations.attendants]
        });

        return list?.attendants || [];
    }

    static async getAttendant(id: string | number, params: WhereOptions<InferAttributes<ContactModel, { omit: never }>>) {
        const user = await UserModel.findByPk(id);
        if (!user) throw new AppProcessError('O usuário não foi localizado', HTTPResponseCode.informationNotFound);
        const attendant = await user.getAttendants({
            where: params
        });
        return attendant;
    }

    static async hasAttendant(user_id: string | number, attendant_id: string | number) {
        const user = await this.get(user_id);
        const attendant = await AttendantModel.findByPk(attendant_id);
        if (!attendant) throw new AppProcessError('O atendente não foi localizado', HTTPResponseCode.informationNotFound);
        return await user.hasAttendant(attendant);
    }

    static async listCustomers(id: string | number) {
        const list = await UserModel.findByPk(id, {
            include: [
                {
                    association: UserModel.associations.clients,
                    include: [CustomerModel.associations.contacts]
                }
            ]
        });

        return list?.clients || [];
    }

    static async getCustomer(id: string | number, params: WhereOptions<InferAttributes<ContactModel, { omit: never }>>) {
        const user = await UserModel.findByPk(id);
        if (!user) throw new AppProcessError('O usuário não foi localizado', HTTPResponseCode.informationNotFound);
        const client = await user.getClients({
            where: params
        });
        return client;
    }

    static async hasCustomer(user_id: string | number, client_id: string | number) {
        const user = await this.get(user_id);
        const client = await CustomerModel.findByPk(client_id);
        if (!client) throw new AppProcessError('O cliente não foi localizado', HTTPResponseCode.informationNotFound);
        return await user.hasClient(client);
    }

    static async listConnections(id: string | number) {
        const list = await UserModel.findByPk(id, {
            include: [
                {
                    association: UserModel.associations.connections,
                    include: [ConnectionModel.associations.profile]
                }
            ]
        });

        return list?.connections || [];
    }

    static async getConnection(id: string | number, params: WhereOptions<InferAttributes<ContactModel, { omit: never }>>) {
        const user = await UserModel.findByPk(id);
        if (!user) throw new AppProcessError('O usuário não foi localizado', HTTPResponseCode.informationNotFound);
        const connections = await user.getConnections({
            where: params
        });
        return connections;
    }

    static async hasConnection(user_id: string | number, conn_id: string | number) {
        const user = await this.get(user_id);
        const connection = await ConnectionModel.findByPk(conn_id);
        if (!connection) throw new AppProcessError('O cliente não foi localizado', HTTPResponseCode.informationNotFound);
        return await user.hasConnection(connection);
    }

    static async listChatbots(id: string | number) {
        const list = await UserModel.findByPk(id, {
            include: [
                {
                    association: UserModel.associations.chatbots
                    /* include: [ConnectionModel.associations.profile] */
                }
            ]
        });

        return list?.chatbots || [];
    }

    static async getChatbot(id: string | number, params: WhereOptions<InferAttributes<ContactModel, { omit: never }>>) {
        const user = await UserModel.findByPk(id);
        if (!user) throw new AppProcessError('O usuário não foi localizado', HTTPResponseCode.informationNotFound);
        const chatbot = await user.getChatbots({
            where: params
        });
        return chatbot;
    }

    static async hasChatbot(user_id: string | number, conn_id: string | number) {
        const user = await this.get(user_id);
        const chatbot = await ChatbotModel.findByPk(conn_id);
        if (!chatbot) throw new AppProcessError('O chatbot não foi localizado', HTTPResponseCode.informationNotFound);
        return await user.hasChatbot(chatbot);
    }

    static async listProfiles(id: string | number) {
        const list = await UserModel.findByPk(id, {
            include: [
                {
                    association: UserModel.associations.profiles
                    /* include: [ConnectionModel.associations.profile] */
                }
            ]
        });

        return list?.profiles || [];
    }

    static async getProfile(id: string | number, params: WhereOptions<InferAttributes<ContactModel, { omit: never }>>) {
        const user = await UserModel.findByPk(id);
        if (!user) throw new AppProcessError('O usuário não foi localizado', HTTPResponseCode.informationNotFound);
        const profiles = await user.getProfiles({
            where: params
        });
        return profiles;
    }

    static async hasProfile(user_id: string | number, conn_id: string | number) {
        const user = await this.get(user_id);
        const profiles = await ConnectionProfilesModel.findByPk(conn_id);
        if (!profiles) throw new AppProcessError('O perfil de conexão não foi localizado', HTTPResponseCode.informationNotFound);
        return await user.hasProfile(profiles);
    }

    static async listWorkflows(id: string | number) {
        const list = await UserModel.findByPk(id, {
            include: [
                {
                    association: UserModel.associations.workflows
                    /* include: [ConnectionModel.associations.profile] */
                }
            ]
        });

        return list?.workflows || [];
    }

    static async getWorkflow(id: string | number, params: WhereOptions<InferAttributes<ContactModel, { omit: never }>>) {
        const user = await UserModel.findByPk(id);
        if (!user) throw new AppProcessError('O usuário não foi localizado', HTTPResponseCode.informationNotFound);
        const profiles = await user.getWorkflows({
            where: params
        });
        return profiles;
    }

    static async hasWorkflow(user_id: string | number, workflow_id: string | number) {
        const user = await this.get(user_id);
        const workflow = await ConnectionProfilesModel.findByPk(workflow_id);
        if (!workflow) throw new AppProcessError('O workflow não foi localizado', HTTPResponseCode.informationNotFound);
        return await user.hasProfile(workflow);
    }
}
