import { SequelizeConnection } from '../Database';
import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, ForeignKey, EnumDataType } from 'sequelize';
import { User } from './User';
import { Client } from './Client';
import { Contact } from './Contact';
import { Chat } from './Chat';
import { Queue } from './Queue';
import { Assessment } from './Assessment';
export class Ticket extends Model<InferAttributes<Ticket>, InferCreationAttributes<Ticket>> {
    declare id?: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']>;
    declare client_id: ForeignKey<Client['id']>;
    declare contact_id: ForeignKey<Contact['id']>;
    declare chat_id: ForeignKey<Chat['id']>;
    declare queue_id: ForeignKey<Queue['id']>;
    declare assessment_id: ForeignKey<Assessment['id']>;
    declare protocolo: string;
    declare status: EnumDataType<'open' | 'closed' | 'queue' | 'waiting' | 'created' | 'canceled'>;
    declare comments: CreationOptional<string>;
    declare params: CreationOptional<object>;

    static associate() {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
        this.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });
        this.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });
        this.belongsTo(Queue, { foreignKey: 'queue_id', as: 'queue' });
        this.belongsTo(Assessment, { foreignKey: 'assessment_id', as: 'assessment' });
    }
}

Ticket.init(
    {
        user_id: DataTypes.INTEGER,
        client_id: DataTypes.INTEGER,
        contact_id: DataTypes.INTEGER,
        chat_id: DataTypes.INTEGER,
        queue_id: DataTypes.INTEGER,
        assessment_id: DataTypes.INTEGER,
        protocolo: DataTypes.STRING,
        status: DataTypes.ENUM('open', 'closed', 'queue', 'waiting', 'created', 'canceled'),
        comments: DataTypes.STRING,
        params: DataTypes.JSON
    },
    { sequelize: SequelizeConnection }
);

//Workflow.sync();
