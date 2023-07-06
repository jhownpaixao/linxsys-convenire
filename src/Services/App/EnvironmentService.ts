import { AppProcessError, HTTPResponseCode, Security } from '@core';
import { Entity } from '@core/class/Entity';
import type { InferAttributes, InferCreationAttributes, Model, WhereOptions } from 'sequelize';
import type { MakeNullishOptional } from 'sequelize/types/utils';
import type { UserAuthMiddlewareProps } from '../../middlewares';
import { logger } from '../Logger';
import {
  AssessmentModel,
  AttendantModel,
  CampaingModel,
  ChatModel,
  ChatbotModel,
  ConnectionModel,
  ConnectionProfilesModel,
  CustomerModel,
  EnvironmentModel,
  ResourceModel,
  UserModel,
  WorkflowModel
} from '../sequelize/Models';
import { FileService } from './FileService';
import { UserService } from './UserService';

type WhereParams<M extends Model> = WhereOptions<InferAttributes<M, { omit: never }>>;

export class EnvironmentService extends Entity {
  // !Static Props
  protected model = EnvironmentModel;

  /**
   * !Static Methods
   * ?Basic Methods
   */
  static async create(
    data: Omit<MakeNullishOptional<InferCreationAttributes<EnvironmentModel>>, 'uniqkey'> & {
      admins: string;
    }
  ) {
    const env = await EnvironmentModel.findOne({
      where: { email: data.email, name: data.name }
    });
    if (env)
      throw new AppProcessError(
        'Este ambiente já está em uso',
        HTTPResponseCode.informationAlreadyExists,
        'warning'
      );

    try {
      const env = await EnvironmentModel.create({
        name: data.name,
        uniqkey: Security.uniqkey(),
        env_token: Security.uniqtoken(4),
        email: data.email,
        isotipo: data.isotipo,
        logotipo: data.logotipo,
        block_with_venc: data.block_with_venc,
        date_venc: data.date_venc,
        params: data.params
      });

      if (data.admins) {
        const adms = data.admins.split(',');
        for (const adm of adms) {
          UserService.update(adm, {
            env_id: env.id
          });
        }
      }

      if (data.isotipo) FileService.save(data.isotipo, 'image');
      if (data.logotipo) FileService.save(data.logotipo, 'image');

      return env;
    } catch (error) {
      logger.error({ data, error }, 'Erro ao criar o ambiente');
      throw new Error('Erro ao criar o ambiente');
    }
  }

  static async delete(id: string | number) {
    const env = await this.get(id);
    if (!env) {
      throw new AppProcessError(
        'O ambiente não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    }
    try {
      if (env.isotipo) FileService.delete(env.isotipo, 'image');
      if (env.logotipo) FileService.delete(env.logotipo, 'image');
      await env.destroy();
      return;
    } catch (error) {
      logger.error({ id, error }, 'Erro ao excluír o usuário');
      throw new Error('Erro ao atualizar o usuário');
    }
  }

  static async update(
    id: string | number,
    data: MakeNullishOptional<InferCreationAttributes<EnvironmentModel>>,
    admins?: string
  ) {
    const env = await this.get(id);
    try {
      const isotipo = env.isotipo;
      const logotipo = env.logotipo;
      await env.update(data);
      await env.reload();

      if (admins) {
        env.removeUsers();
        const adms = admins.split(',');
        for (const adm of adms) {
          const user = await UserService.get(adm);
          env.addUser(user);
          /* UserService.update(adm, {
            env_id: env.id
          }); */
        }
      }

      if (data.isotipo && data.isotipo != isotipo) {
        FileService.save(data.isotipo, 'image');
        FileService.delete(isotipo, 'image');
      }

      if (data.logotipo && data.logotipo != logotipo) {
        FileService.save(data.logotipo, 'image');
        FileService.delete(logotipo, 'image');
      }

      return env;
    } catch (error) {
      logger.error({ data, error }, 'Erro ao atualizar o ambiente');
      throw new Error('Erro ao atualizar o ambiente');
    }
  }

  static async get(id: string | number) {
    const env = await EnvironmentModel.findByPk(id, {
      include: [EnvironmentModel.associations.users]
    });
    if (!env)
      throw new AppProcessError(
        'O ambiente não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    return env;
  }

  static async getWith(params: WhereParams<EnvironmentModel>) {
    const register = await EnvironmentModel.findOne({
      where: params
    });
    return register;
  }

  static async getWithFullData(params: WhereParams<EnvironmentModel>) {
    const register = await EnvironmentModel.scope('fullData').findOne({ where: params });
    return register;
  }

  static async list() {
    try {
      const list = await EnvironmentModel.findAll({
        include: [
          {
            association: EnvironmentModel.associations.users,
            attributes: ['name', 'id', 'picture']
          }
        ]
      });
      return list;
    } catch (error) {
      logger.error({ error }, 'Erro ao buscar a lista de ambientes');
      throw new Error('Erro ao buscar a lista de ambientes');
    }
  }

  static async listWith(params: WhereParams<EnvironmentModel>) {
    try {
      const list = await EnvironmentModel.findAll({ where: params });
      return list;
    } catch (error) {
      logger.error({ error }, 'Erro ao buscar a lista de ambientes');
      throw new Error('Erro ao buscar a lista de ambientes');
    }
  }

  // ?Advanced Methods

  /**
   * TODO: System
   */

  static async sign(id: string, user: UserAuthMiddlewareProps) {
    const env = await EnvironmentModel.findByPk(id);
    if (!env)
      throw new AppProcessError(
        'O ambiente não foi localizado',
        HTTPResponseCode.informationNotFound,
        'warning'
      );

    if (user.type != 'SuperAdmin' && parseInt(user.env_id) !== env.id)
      throw new AppProcessError(
        'Sem autorização de acesso à este ambiente',
        HTTPResponseCode.informationBlocked
      );

    return env;
  }

  /**
   * TODO: Attendants
   */
  static listAttendants = (env_id: string | number) =>
    this.handleList(EnvironmentModel, env_id, 'attendants');

  static getAttendant = (env_id: string | number, params: WhereParams<ChatModel>) =>
    this.handleGet(EnvironmentModel, env_id, 'Attendants', params);

  static hasAttendant = (env_id: string | number, attendant_id: string | number) =>
    this.handleHas(EnvironmentModel, env_id, AttendantModel, attendant_id, 'Attendant');

  /**
   * TODO: Customers
   */
  static listCustomers = (env_id: string | number) =>
    this.handleList(EnvironmentModel, env_id, 'clients', [CustomerModel, 'contacts']);

  static getCustomer = (env_id: string | number, params: WhereParams<CustomerModel>) =>
    this.handleGet(EnvironmentModel, env_id, 'Clients', params);

  static hasCustomer = (env_id: string | number, client_id: string | number) =>
    this.handleHas(EnvironmentModel, env_id, CustomerModel, client_id, 'Client');

  /**
   * TODO: Connections
   */
  static listConnections = (env_id: string | number) =>
    this.handleList(EnvironmentModel, env_id, 'connections', [ConnectionModel, 'profile']);

  static getConnection = (env_id: string | number, params: WhereParams<ConnectionModel>) =>
    this.handleGet(EnvironmentModel, env_id, 'Connections', params);

  static hasConnection = (env_id: string | number, conn_id: string | number) =>
    this.handleHas(EnvironmentModel, env_id, ConnectionModel, conn_id, 'Connection');

  /**
   * TODO: Robots
   */
  static listChatbots = (env_id: string | number) =>
    this.handleList(EnvironmentModel, env_id, 'chatbots', [ChatbotModel, 'workflow']);

  static getChatbot = (env_id: string | number, params: WhereParams<ChatbotModel>) =>
    this.handleGet(EnvironmentModel, env_id, 'Chatbots', params);

  static hasChatbot = (env_id: string | number, chatbot_id: string | number) =>
    this.handleHas(EnvironmentModel, env_id, ChatbotModel, chatbot_id, 'Chatbot');

  /**
   * TODO: Connections Profiles
   */
  static listProfiles = (env_id: string | number) =>
    this.handleList(EnvironmentModel, env_id, 'profiles', [ConnectionProfilesModel, 'chatbot']);

  static getProfile = (env_id: string | number, params: WhereParams<ConnectionProfilesModel>) =>
    this.handleGet(EnvironmentModel, env_id, 'Profiles', params);

  static hasProfile = (env_id: string | number, profile_id: string | number) =>
    this.handleHas(EnvironmentModel, env_id, ConnectionProfilesModel, profile_id, 'Profile');

  /**
   * TODO: Robot Workflows
   */
  static listWorkflows = (env_id: string | number) =>
    this.handleList(EnvironmentModel, env_id, 'workflows');

  static getWorkflow = (env_id: string | number, params: WhereParams<WorkflowModel>) =>
    this.handleGet(EnvironmentModel, env_id, 'Workflows', params);

  static hasWorkflow = (env_id: string | number, flow_id: string | number) =>
    this.handleHas(EnvironmentModel, env_id, WorkflowModel, flow_id, 'Workflow');

  /**
   * TODO: Assessments
   */
  static listAssessments = (env_id: string | number) =>
    this.handleList(EnvironmentModel, env_id, 'assessments');

  static getAssessment = (env_id: string | number, params: WhereParams<AssessmentModel>) =>
    this.handleGet(EnvironmentModel, env_id, 'Assessments', params);

  static hasAssessment = (env_id: string | number, flow_id: string | number) =>
    this.handleHas(EnvironmentModel, env_id, AssessmentModel, flow_id, 'Assessment');

  /**
   * TODO: Chat
   */
  static listChats = (env_id: string | number) =>
    this.handleList(EnvironmentModel, env_id, 'chats');

  static getChat = (env_id: string | number, params: WhereParams<ChatModel>) =>
    this.handleGet(EnvironmentModel, env_id, 'Chats', params);

  static hasChat = (env_id: string | number, chat_id: string | number) =>
    this.handleHas(EnvironmentModel, env_id, ChatModel, chat_id, 'Chat');

  /**
   * TODO: Users
   */
  static listUsers = (env_id: string | number) =>
    this.handleList(EnvironmentModel, env_id, 'users');

  static getUser = (env_id: string | number, params: WhereParams<UserModel>) =>
    this.handleGet(EnvironmentModel, env_id, 'Users', params);

  static hasUser = (env_id: string | number, chat_id: string | number) =>
    this.handleHas(EnvironmentModel, env_id, UserModel, chat_id, 'User');

  /**
   * TODO: Campaings
   */
  static listCampaings = (env_id: string | number) =>
    this.handleList(EnvironmentModel, env_id, 'campaings');

  static getCampaing = (env_id: string | number, params: WhereParams<CampaingModel>) =>
    this.handleGet(EnvironmentModel, env_id, 'Campaings', params);

  static hasCampaing = (env_id: string | number, chat_id: string | number) =>
    this.handleHas(EnvironmentModel, env_id, CampaingModel, chat_id, 'Campaing');

  /**
   * TODO: Resources
   */
  static listResources = (env_id: string | number) =>
    this.handleList(EnvironmentModel, env_id, 'resources');

  static getResource = (env_id: string | number, params: WhereParams<ResourceModel>) =>
    this.handleGet(EnvironmentModel, env_id, 'Resources', params);

  static hasResource = (env_id: string | number, chat_id: string | number) =>
    this.handleHas(EnvironmentModel, env_id, ResourceModel, chat_id, 'Resource');
}
