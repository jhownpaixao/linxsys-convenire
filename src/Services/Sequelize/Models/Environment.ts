import type {
  CreationOptional,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute
} from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { SequelizeConnection } from '../Database';
import { Assessment } from './Assessment';
import { Attendant } from './Attendant';
import { Chat } from './Chat';
import { Chatbot } from './Chatbot';
import { Client } from './Client';
import { Connection } from './Connection';
import { ConnectionProfiles } from './ConnectionProfile';
import { Contact } from './Contact';
import { Queue } from './Queue';
import { Resource } from './Resource';
import { Tag } from './Tag';
import { User } from './User';
import { Workflow } from './Workflow';
import { Campaing } from './Campaing';

export class Environment extends Model<
  InferAttributes<Environment>,
  InferCreationAttributes<Environment>
> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare email: CreationOptional<string>;
  declare isotipo: CreationOptional<string>;
  declare logotipo: CreationOptional<string>;
  declare uniqkey: string;
  declare env_token: string;
  declare blocked: string;
  declare block_with_venc: string;
  declare date_venc: Date;
  declare params: CreationOptional<object>;

  declare getAttendants: HasManyGetAssociationsMixin<Attendant>; // Note the null assertions!
  declare addAttendant: HasManyAddAssociationMixin<Attendant, number>;
  declare addAttendants: HasManyAddAssociationsMixin<Attendant, number>;
  declare setAttendants: HasManySetAssociationsMixin<Attendant, number>;
  declare removeAttendant: HasManyRemoveAssociationMixin<Attendant, number>;
  declare removeAttendants: HasManyRemoveAssociationsMixin<Attendant, number>;
  declare hasAttendant: HasManyHasAssociationMixin<Attendant, number>;
  declare hasAttendants: HasManyHasAssociationsMixin<Attendant, number>;
  declare countAttendants: HasManyCountAssociationsMixin;
  declare createAttendant: HasManyCreateAssociationMixin<Attendant, 'env_id'>;
  declare attendants?: NonAttribute<Attendant[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare getClients: HasManyGetAssociationsMixin<Client>; // Note the null assertions!
  declare addClient: HasManyAddAssociationMixin<Client, number>;
  declare addClients: HasManyAddAssociationsMixin<Client, number>;
  declare setClients: HasManySetAssociationsMixin<Client, number>;
  declare removeClient: HasManyRemoveAssociationMixin<Client, number>;
  declare removeClients: HasManyRemoveAssociationsMixin<Client, number>;
  declare hasClient: HasManyHasAssociationMixin<Client, number>;
  declare hasClients: HasManyHasAssociationsMixin<Client, number>;
  declare countClients: HasManyCountAssociationsMixin;
  declare createClient: HasManyCreateAssociationMixin<Client, 'env_id'>;
  declare clients?: NonAttribute<Client[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare getContacts: HasManyGetAssociationsMixin<Contact>; // Note the null assertions!
  declare addContact: HasManyAddAssociationMixin<Contact, number>;
  declare addContacts: HasManyAddAssociationsMixin<Contact, number>;
  declare setContacts: HasManySetAssociationsMixin<Contact, number>;
  declare removeContact: HasManyRemoveAssociationMixin<Contact, number>;
  declare removeContacts: HasManyRemoveAssociationsMixin<Contact, number>;
  declare hasContact: HasManyHasAssociationMixin<Contact, number>;
  declare hasContacts: HasManyHasAssociationsMixin<Contact, number>;
  declare countContacts: HasManyCountAssociationsMixin;
  declare createContact: HasManyCreateAssociationMixin<Contact, 'env_id'>;
  declare contacts?: NonAttribute<Contact[]>;

  declare getChatbots: HasManyGetAssociationsMixin<Chatbot>; // Note the null assertions!
  declare addChatbot: HasManyAddAssociationMixin<Chatbot, number>;
  declare addChatbots: HasManyAddAssociationsMixin<Chatbot, number>;
  declare setChatbots: HasManySetAssociationsMixin<Chatbot, number>;
  declare removeChatbot: HasManyRemoveAssociationMixin<Chatbot, number>;
  declare removeChatbots: HasManyRemoveAssociationsMixin<Chatbot, number>;
  declare hasChatbot: HasManyHasAssociationMixin<Chatbot, number>;
  declare hasChatbots: HasManyHasAssociationsMixin<Chatbot, number>;
  declare countChatbots: HasManyCountAssociationsMixin;
  declare createChatbot: HasManyCreateAssociationMixin<Chatbot, 'env_id'>;
  declare chatbots?: NonAttribute<Chatbot[]>;

  declare getConnections: HasManyGetAssociationsMixin<Connection>; // Note the null assertions!
  declare addConnection: HasManyAddAssociationMixin<Connection, number>;
  declare addConnections: HasManyAddAssociationsMixin<Connection, number>;
  declare setConnections: HasManySetAssociationsMixin<Connection, number>;
  declare removeConnection: HasManyRemoveAssociationMixin<Connection, number>;
  declare removeConnections: HasManyRemoveAssociationsMixin<Connection, number>;
  declare hasConnection: HasManyHasAssociationMixin<Connection, number>;
  declare hasConnections: HasManyHasAssociationsMixin<Connection, number>;
  declare countConnections: HasManyCountAssociationsMixin;
  declare createConnection: HasManyCreateAssociationMixin<Connection, 'env_id'>;
  declare connections?: NonAttribute<Connection[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare getProfiles: HasManyGetAssociationsMixin<ConnectionProfiles>; // Note the null assertions!
  declare addProfile: HasManyAddAssociationMixin<ConnectionProfiles, number>;
  declare addProfiles: HasManyAddAssociationsMixin<ConnectionProfiles, number>;
  declare setProfiles: HasManySetAssociationsMixin<ConnectionProfiles, number>;
  declare removeProfile: HasManyRemoveAssociationMixin<ConnectionProfiles, number>;
  declare removeProfiles: HasManyRemoveAssociationsMixin<ConnectionProfiles, number>;
  declare hasProfile: HasManyHasAssociationMixin<ConnectionProfiles, number>;
  declare hasProfiles: HasManyHasAssociationsMixin<ConnectionProfiles, number>;
  declare countProfiles: HasManyCountAssociationsMixin;
  declare createProfile: HasManyCreateAssociationMixin<ConnectionProfiles, 'env_id'>;
  declare profiles?: NonAttribute<ConnectionProfiles[]>;

  declare getWorkflows: HasManyGetAssociationsMixin<Workflow>; // Note the null assertions!
  declare addWorkflow: HasManyAddAssociationMixin<Workflow, number>;
  declare addWorkflows: HasManyAddAssociationsMixin<Workflow, number>;
  declare setWorkflows: HasManySetAssociationsMixin<Workflow, number>;
  declare removeWorkflow: HasManyRemoveAssociationMixin<Workflow, number>;
  declare removeWorkflows: HasManyRemoveAssociationsMixin<Workflow, number>;
  declare hasWorkflow: HasManyHasAssociationMixin<Workflow, number>;
  declare hasWorkflows: HasManyHasAssociationsMixin<Workflow, number>;
  declare countWorkflows: HasManyCountAssociationsMixin;
  declare createWorkflow: HasManyCreateAssociationMixin<Workflow, 'env_id'>;
  declare workflows?: NonAttribute<Workflow[]>;

  declare getTags: HasManyGetAssociationsMixin<Tag>; // Note the null assertions!
  declare addTag: HasManyAddAssociationMixin<Tag, number>;
  declare addTags: HasManyAddAssociationsMixin<Tag, number>;
  declare setTags: HasManySetAssociationsMixin<Tag, number>;
  declare removeTag: HasManyRemoveAssociationMixin<Tag, number>;
  declare removeTags: HasManyRemoveAssociationsMixin<Tag, number>;
  declare hasTag: HasManyHasAssociationMixin<Tag, number>;
  declare hasTags: HasManyHasAssociationsMixin<Tag, number>;
  declare countTags: HasManyCountAssociationsMixin;
  declare createTag: HasManyCreateAssociationMixin<Tag, 'env_id'>;
  declare tags?: NonAttribute<Tag[]>;

  declare getChats: HasManyGetAssociationsMixin<Chat>; // Note the null assertions!
  declare addChat: HasManyAddAssociationMixin<Chat, number>;
  declare addChats: HasManyAddAssociationsMixin<Chat, number>;
  declare setChats: HasManySetAssociationsMixin<Chat, number>;
  declare removeChat: HasManyRemoveAssociationMixin<Chat, number>;
  declare removeChats: HasManyRemoveAssociationsMixin<Chat, number>;
  declare hasChat: HasManyHasAssociationMixin<Chat, number>;
  declare hasChats: HasManyHasAssociationsMixin<Chat, number>;
  declare countChats: HasManyCountAssociationsMixin;
  declare createChat: HasManyCreateAssociationMixin<Chat, 'env_id'>;
  declare chats?: NonAttribute<Chat[]>;

  declare getQueues: HasManyGetAssociationsMixin<Queue>; // Note the null assertions!
  declare addQueue: HasManyAddAssociationMixin<Queue, number>;
  declare addQueues: HasManyAddAssociationsMixin<Queue, number>;
  declare setQueues: HasManySetAssociationsMixin<Queue, number>;
  declare removeQueue: HasManyRemoveAssociationMixin<Queue, number>;
  declare removeQueues: HasManyRemoveAssociationsMixin<Queue, number>;
  declare hasQueue: HasManyHasAssociationMixin<Queue, number>;
  declare hasQueues: HasManyHasAssociationsMixin<Queue, number>;
  declare countQueues: HasManyCountAssociationsMixin;
  declare createQueue: HasManyCreateAssociationMixin<Queue, 'env_id'>;
  declare queues?: NonAttribute<Queue[]>;

  declare getAssessments: HasManyGetAssociationsMixin<Assessment>; // Note the null assertions!
  declare addAssessment: HasManyAddAssociationMixin<Assessment, number>;
  declare addAssessments: HasManyAddAssociationsMixin<Assessment, number>;
  declare setAssessments: HasManySetAssociationsMixin<Assessment, number>;
  declare removeAssessment: HasManyRemoveAssociationMixin<Assessment, number>;
  declare removeAssessments: HasManyRemoveAssociationsMixin<Assessment, number>;
  declare hasAssessment: HasManyHasAssociationMixin<Assessment, number>;
  declare hasAssessments: HasManyHasAssociationsMixin<Assessment, number>;
  declare countAssessments: HasManyCountAssociationsMixin;
  declare createAssessment: HasManyCreateAssociationMixin<Assessment, 'env_id'>;
  declare assessments?: NonAttribute<Assessment[]>;

  declare getResources: HasManyGetAssociationsMixin<Resource>; // Note the null assertions!
  declare addResource: HasManyAddAssociationMixin<Resource, number>;
  declare addResources: HasManyAddAssociationsMixin<Resource, number>;
  declare setResources: HasManySetAssociationsMixin<Resource, number>;
  declare removeResource: HasManyRemoveAssociationMixin<Resource, number>;
  declare removeResources: HasManyRemoveAssociationsMixin<Resource, number>;
  declare hasResource: HasManyHasAssociationMixin<Resource, number>;
  declare hasResources: HasManyHasAssociationsMixin<Resource, number>;
  declare countResources: HasManyCountAssociationsMixin;
  declare createResource: HasManyCreateAssociationMixin<Resource, 'env_id'>;
  declare resources?: NonAttribute<Resource[]>;

  declare getUsers: HasManyGetAssociationsMixin<User>; // Note the null assertions!
  declare addUser: HasManyAddAssociationMixin<User, number>;
  declare addUsers: HasManyAddAssociationsMixin<User, number>;
  declare setUsers: HasManySetAssociationsMixin<User, number>;
  declare removeUser: HasManyRemoveAssociationMixin<User, number>;
  declare removeUsers: HasManyRemoveAssociationsMixin<User, number>;
  declare hasUser: HasManyHasAssociationMixin<User, number>;
  declare hasUsers: HasManyHasAssociationsMixin<User, number>;
  declare countUsers: HasManyCountAssociationsMixin;
  declare createUser: HasManyCreateAssociationMixin<User, 'env_id'>;
  declare users?: NonAttribute<User[]>;

  declare getCampaings: HasManyGetAssociationsMixin<Campaing>; // Note the null assertions!
  declare addCampaing: HasManyAddAssociationMixin<Campaing, number>;
  declare addCampaings: HasManyAddAssociationsMixin<Campaing, number>;
  declare setCampaings: HasManySetAssociationsMixin<Campaing, number>;
  declare removeCampaing: HasManyRemoveAssociationMixin<Campaing, number>;
  declare removeCampaings: HasManyRemoveAssociationsMixin<Campaing, number>;
  declare hasCampaing: HasManyHasAssociationMixin<Campaing, number>;
  declare hasCampaings: HasManyHasAssociationsMixin<Campaing, number>;
  declare countCampaings: HasManyCountAssociationsMixin;
  declare createCampaing: HasManyCreateAssociationMixin<Campaing, 'env_id'>;
  declare campaings?: NonAttribute<Campaing[]>;

  static associate() {
    this.hasMany(Attendant, { foreignKey: 'env_id', as: 'attendants' });
    this.hasMany(Client, { foreignKey: 'env_id', as: 'clients' });
    this.hasMany(Connection, { foreignKey: 'env_id', as: 'connections' });
    this.hasMany(ConnectionProfiles, { foreignKey: 'env_id', as: 'profiles' });
    this.hasMany(Contact, { foreignKey: 'env_id', as: 'contacts' });
    this.hasMany(Chatbot, { foreignKey: 'env_id', as: 'chatbots' });
    this.hasMany(Workflow, { foreignKey: 'env_id', as: 'workflows' });
    this.hasMany(Tag, { foreignKey: 'env_id', as: 'tags' });
    this.hasMany(Queue, { foreignKey: 'env_id', as: 'queues' });
    this.hasMany(Chat, { foreignKey: 'env_id', as: 'chats' });
    this.hasMany(Assessment, { foreignKey: 'env_id', as: 'assessments' });
    this.hasMany(Resource, { foreignKey: 'env_id', as: 'resources' });
    this.hasMany(User, { foreignKey: 'env_id', as: 'users' });
    this.hasMany(Campaing, { foreignKey: 'env_id', as: 'campaings' });
  }
}

Environment.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    isotipo: DataTypes.STRING,
    logotipo: DataTypes.STRING,
    uniqkey: DataTypes.STRING,
    blocked: DataTypes.STRING,
    block_with_venc: DataTypes.STRING,
    date_venc: DataTypes.DATE,
    env_token: DataTypes.STRING,
    params: DataTypes.JSON
  },
  {
    sequelize: SequelizeConnection,
    defaultScope: {
      attributes: { exclude: ['pass', 'uniqkey', 'params', 'auth_token'] }
    },
    scopes: {
      fullData: {
        attributes: [
          'id',
          'name',
          'pass',
          'email',
          'uniqkey',
          'type',
          'block_with_venc',
          'group_id',
          'auth_token',
          'date_venc',
          'params',
          'createdAt',
          'updatedAt'
        ]
      }
    }
  }
);

//User.sync();
