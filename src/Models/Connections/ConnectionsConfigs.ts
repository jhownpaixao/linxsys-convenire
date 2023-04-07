import { SequelizeConnection } from '../../Core';
import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, ForeignKey } from 'sequelize';
import { uuid } from "uuidv4";
import { Connection } from './Connection';
import { Chatbot } from '../Chatbot';
export class ConnectionsConfigs extends Model<InferAttributes<ConnectionsConfigs>, InferCreationAttributes<ConnectionsConfigs>> {
    declare id?: CreationOptional<number>;
    declare name: string;
    declare queues: CreationOptional<object>;
    declare chatbot_id: ForeignKey<Chatbot['id']>;
    declare default_messages: CreationOptional<object>;
    declare comments: CreationOptional<string>;
    declare params: CreationOptional<object>;

    static associate(models: any) {
        this.hasOne(Chatbot, { foreignKey: 'id', as: 'config' });
    }
}

ConnectionsConfigs.init({
    name: DataTypes.STRING,
    queues: DataTypes.JSON,
    chatbot_id: DataTypes.INTEGER,
    default_messages: DataTypes.JSON,
    params: DataTypes.JSON,
    comments: DataTypes.STRING
}, { sequelize: SequelizeConnection });

//Connection.sync();