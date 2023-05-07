import { SequelizeConnection } from '../Database';
import {
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationsMixin,
    HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute
} from 'sequelize';
import { Attendant } from './Attendant';
import { Client } from './Client';
import { ConnectionProfiles } from './ConnectionProfiles';
import { Connection } from './Connection';
import { Contact } from './Contact';
import { Chatbot } from './Chatbot';
import { Workflow } from './Workflow';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id?: CreationOptional<number>;
    declare name: string;
    declare pass: string;
    declare email: string;
    declare uniqkey: string;
    declare type: string;
    declare block_with_venc: string;
    declare group_id: CreationOptional<number>;
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
    declare createAttendant: HasManyCreateAssociationMixin<Attendant, 'user_id'>;
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
    declare createClient: HasManyCreateAssociationMixin<Client, 'user_id'>;
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
    declare createContact: HasManyCreateAssociationMixin<Contact, 'user_id'>;
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
    declare createChatbot: HasManyCreateAssociationMixin<Chatbot, 'user_id'>;
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
    declare createConnection: HasManyCreateAssociationMixin<Connection, 'user_id'>;
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
    declare createProfile: HasManyCreateAssociationMixin<ConnectionProfiles, 'user_id'>;
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
    declare createWorkflow: HasManyCreateAssociationMixin<Workflow, 'user_id'>;
    declare workflows?: NonAttribute<ConnectionProfiles[]>;

    static associate() {
        this.hasMany(Attendant, { foreignKey: 'user_id', as: 'attendants' });
        this.hasMany(Client, { foreignKey: 'user_id', as: 'clients' });
        this.hasMany(Connection, { foreignKey: 'user_id', as: 'connections' });
        this.hasMany(ConnectionProfiles, { foreignKey: 'user_id', as: 'profiles' });
        this.hasMany(Contact, { foreignKey: 'user_id', as: 'contacts' });
        this.hasMany(Chatbot, { foreignKey: 'user_id', as: 'chatbots' });
        this.hasMany(Workflow, { foreignKey: 'user_id', as: 'workflows' });
    }
}

User.init(
    {
        name: DataTypes.STRING,
        pass: DataTypes.STRING,
        email: DataTypes.STRING,
        uniqkey: DataTypes.STRING,
        type: DataTypes.STRING,
        block_with_venc: DataTypes.STRING,
        group_id: DataTypes.INTEGER,
        date_venc: DataTypes.DATE,
        params: DataTypes.JSON
    },
    {
        sequelize: SequelizeConnection,
        defaultScope: {
            attributes: { exclude: ['pass', 'uniqkey', 'params'] }
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
