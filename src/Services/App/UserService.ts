import type { MakeNullishOptional } from 'sequelize/types/utils';
import { AppProcessError, Security, HTTPResponseCode } from '@core';
import { logger } from '../logger';
import { WorkflowModel } from '../sequelize/Models';
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
  protected model = UserModel;

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

  static async getWith(params: WhereParams<UserModel>) {
    const register = await UserModel.findOne({
      where: params
    });
    return register;
  }

  static async getWithFullData(params: WhereParams<UserModel>) {
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
    this.handleList(UserModel, user_id, 'connections', [ConnectionModel, 'profile']);

  static getConnection = (user_id: string | number, params: WhereParams<ConnectionModel>) =>
    this.handleGet(UserModel, user_id, 'Connections', params);

  static hasConnection = (user_id: string | number, conn_id: string | number) =>
    this.handleHas(UserModel, user_id, ConnectionModel, conn_id, 'Connection');

  /**
   * TODO: Robots
   */
  static listChatbots = (user_id: string | number) =>
    this.handleList(UserModel, user_id, 'chatbots', [ChatbotModel, 'workflow']);

  static getChatbot = (user_id: string | number, params: WhereParams<ChatbotModel>) =>
    this.handleGet(UserModel, user_id, 'Chatbots', params);

  static hasChatbot = (user_id: string | number, chatbot_id: string | number) =>
    this.handleHas(UserModel, user_id, ChatbotModel, chatbot_id, 'Chatbot');

  /**
   * TODO: Connections Profiles
   */
  static listProfiles = (user_id: string | number) =>
    this.handleList(UserModel, user_id, 'profiles', [ConnectionProfilesModel, 'chatbot']);

  static getProfile = (user_id: string | number, params: WhereParams<ConnectionProfilesModel>) =>
    this.handleGet(UserModel, user_id, 'Profiles', params);

  static hasProfile = (user_id: string | number, profile_id: string | number) =>
    this.handleHas(UserModel, user_id, ConnectionProfilesModel, profile_id, 'Profile');

  /**
   * TODO: Robot Workflows
   */
  static listWorkflows = (user_id: string | number) =>
    this.handleList(UserModel, user_id, 'workflows');

  static getWorkflow = (user_id: string | number, params: WhereParams<WorkflowModel>) =>
    this.handleGet(UserModel, user_id, 'Workflows', params);

  static hasWorkflow = (user_id: string | number, flow_id: string | number) =>
    this.handleHas(UserModel, user_id, WorkflowModel, flow_id, 'Workflow');

  /**
   * TODO: Assessments
   */
  static listAssessments = (user_id: string | number) =>
    this.handleList(UserModel, user_id, 'assessments');

  static getAssessment = (user_id: string | number, params: WhereParams<AssessmentModel>) =>
    this.handleGet(UserModel, user_id, 'Assessments', params);

  static hasAssessment = (user_id: string | number, flow_id: string | number) =>
    this.handleHas(UserModel, user_id, AssessmentModel, flow_id, 'Assessment');

  /**
   * TODO: Chat
   */
  static listChats = (user_id: string | number) => this.handleList(UserModel, user_id, 'chats');

  static getChat = (user_id: string | number, params: WhereParams<ChatModel>) =>
    this.handleGet(UserModel, user_id, 'Chats', params);

  static hasChat = (user_id: string | number, chat_id: string | number) =>
    this.handleHas(UserModel, user_id, ChatModel, chat_id, 'Chat');
}
