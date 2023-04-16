import { SequelizeConnection } from '../Core';
import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from 'sequelize';
import { Models } from '.';
export class Chatbot extends Model<InferAttributes<Chatbot>, InferCreationAttributes<Chatbot>> {
    declare id?: CreationOptional<number>;
    declare name: string;
    declare queues: CreationOptional<object>;
    declare user_id: number;
    declare default_messages: object;
    declare workflow: object;
    declare comments: CreationOptional<string>;
    declare params: CreationOptional<object>;

    static associate() {
        this.belongsTo(Models.User, { foreignKey: 'user_id', as: 'user' });
    }
}

Chatbot.init(
    {
        name: DataTypes.STRING,
        queues: DataTypes.JSON,
        user_id: DataTypes.INTEGER,
        default_messages: DataTypes.JSON,
        workflow: DataTypes.JSON,
        comments: DataTypes.STRING,
        params: DataTypes.JSON
    },
    { sequelize: SequelizeConnection }
);

//Chatbot.sync();
