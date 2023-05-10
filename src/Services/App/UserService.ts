import type { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, Security, HTTPResponseCode } from '@core';
import { logger } from '../logger';
import type { WorkflowModel } from '../sequelize/Models';
import {
  AssessmentModel,
  AttendantModel,
  ChatModel,
  ChatbotModel,
  ConnectionModel,
  ConnectionProfilesModel,
  CustomerModel,
  UserModel
} from '../sequelize/Models';
import bcrypt from 'bcrypt';
import type { InferAttributes, InferCreationAttributes, Model, WhereOptions } from 'sequelize';
import { Entity } from '@core/class/Entity';

type WhereParams<M extends Model> = WhereOptions<InferAttributes<M, { omit: never }>>;

export class UserService extends Entity {
  // !Static Props
  model = UserModel;

  /**
   * !Static Methods
   * ?Basic Methods
   */
  static async create(
    data: Omit<MakeNullishOptional<InferCreationAttributes<UserModel>>, 'uniqkey'>
  ) {
    const user = await UserModel.findOne({
      where: { email: data.email }
    });
    if (user)
      throw new AppProcessError(
        'Este email já está cadastrado',
        HTTPResponseCode.informationAlreadyExists,
        'warning'
      );

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
      throw new AppProcessError(
        'O usuário não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    }
    try {
      await user.destroy();
      return;
    } catch (error) {
      logger.error({ id, error }, 'Erro ao excluír o usuário');
      throw new Error('Erro ao atualizar o usuário');
    }
  }

  static async update(
    id: string | number,
    data: MakeNullishOptional<InferCreationAttributes<UserModel>>
  ) {
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
    if (!user)
      throw new AppProcessError(
        'O usuário não foi localizado',
        HTTPResponseCode.informationNotFound
      );
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

  // ?Advanced Methods

  /**
   * TODO: Attendants
   */
  static listAttendants = (user_id: string | number) =>
    this.handleList(UserModel, user_id, 'attendants');

  static getAttendant = (user_id: string | number, params: WhereParams<ChatModel>) =>
    this.handleGet(UserModel, user_id, 'Attendants', params);

  static hasAttendant = (user_id: string | number, attendant_id: string | number) =>
    this.handleHas(UserModel, user_id, AttendantModel, attendant_id, 'Attendant');

  /**
   * TODO: Customers
   */
  static listCustomers = (user_id: string | number) =>
    this.handleList(UserModel, user_id, 'clients', [CustomerModel, 'contacts']);

  static getCustomer = (user_id: string | number, params: WhereParams<CustomerModel>) =>
    this.handleGet(UserModel, user_id, 'Clients', params);

  static hasCustomer = (user_id: string | number, client_id: string | number) =>
    this.handleHas(UserModel, user_id, CustomerModel, client_id, 'Client');

  /**
   * TODO: Connections
   */
  static listConnections = (user_id: string | number) =>
    this.handleList(UserModel, user_id, 'connections', [ConnectionProfilesModel, 'profiles']);

  static getConnection = (user_id: string | number, params: WhereParams<ConnectionModel>) =>
    this.handleGet(UserModel, user_id, 'Connection', params);

  static hasConnection = (user_id: string | number, conn_id: string | number) =>
    this.handleHas(UserModel, user_id, ConnectionModel, conn_id, 'Connection');

  /**
   * TODO: Robots
   */
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

  static async getChatbot(
    id: string | number,
    params: WhereOptions<InferAttributes<ChatbotModel, { omit: never }>>
  ) {
    const user = await UserModel.findByPk(id);
    if (!user)
      throw new AppProcessError(
        'O usuário não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    const chatbot = await user.getChatbots({
      where: params
    });
    return chatbot;
  }

  static async hasChatbot(user_id: string | number, conn_id: string | number) {
    const user = await this.get(user_id);
    const chatbot = await ChatbotModel.findByPk(conn_id);
    if (!chatbot)
      throw new AppProcessError(
        'O chatbot não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    return await user.hasChatbot(chatbot);
  }

  /**
   * TODO: Connections Profiles
   */
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

  static async getProfile(
    id: string | number,
    params: WhereOptions<InferAttributes<ConnectionProfilesModel, { omit: never }>>
  ) {
    const user = await UserModel.findByPk(id);
    if (!user)
      throw new AppProcessError(
        'O usuário não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    const profiles = await user.getProfiles({
      where: params
    });
    return profiles;
  }

  static async hasProfile(user_id: string | number, conn_id: string | number) {
    const user = await this.get(user_id);
    const profiles = await ConnectionProfilesModel.findByPk(conn_id);
    if (!profiles)
      throw new AppProcessError(
        'O perfil de conexão não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    return await user.hasProfile(profiles);
  }

  /**
   * TODO: Robot Workflows
   */
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

  static async getWorkflow(
    id: string | number,
    params: WhereOptions<InferAttributes<WorkflowModel, { omit: never }>>
  ) {
    const user = await UserModel.findByPk(id);
    if (!user)
      throw new AppProcessError(
        'O usuário não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    const profiles = await user.getWorkflows({
      where: params
    });
    return profiles;
  }

  static async hasWorkflow(user_id: string | number, workflow_id: string | number) {
    const user = await this.get(user_id);
    const workflow = await ConnectionProfilesModel.findByPk(workflow_id);
    if (!workflow)
      throw new AppProcessError(
        'O workflow não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    return await user.hasProfile(workflow);
  }

  /**
   * TODO: Assessments
   */
  static async listAssessments(id: string | number) {
    const list = await UserModel.findByPk(id, {
      include: [
        {
          association: UserModel.associations.assessments
          /* include: [ConnectionModel.associations.profile] */
        }
      ]
    });

    return list?.assessments || [];
  }

  static async getAssessment(
    id: string | number,
    params: WhereOptions<InferAttributes<AssessmentModel, { omit: never }>>
  ) {
    const user = await UserModel.findByPk(id);
    if (!user)
      throw new AppProcessError(
        'O usuário não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    const profiles = await user.getAssessments({
      where: params
    });
    return profiles;
  }

  static async hasAssessment(user_id: string | number, assessment_id: string | number) {
    const user = await this.get(user_id);
    const assessment = await AssessmentModel.findByPk(assessment_id);
    if (!assessment)
      throw new AppProcessError(
        'A avalização não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    return await user.hasAssessment(assessment);
  }

  /**
   * TODO: Chat
   */
  static hasChat = (user_id: string | number, chat_id: string | number) =>
    this.handleHas(UserModel, user_id, ChatModel, chat_id, 'Chat');

  static getChat = (user_id: string | number, params: WhereParams<ChatModel>) =>
    this.handleGet(UserModel, user_id, 'Chat', params);

  static listChats = (user_id: string | number) => this.handleList(UserModel, user_id, 'chats');
}
