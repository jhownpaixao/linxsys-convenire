import { SequelizeConnection } from '../../Database';
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    DataTypes,
    CreationOptional,
    ForeignKey,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    HasOneCreateAssociationMixin,
    NonAttribute
} from 'sequelize';
import { Chatbot } from '../Chatbot';
import { User } from '../User';
export class ConnectionProfiles extends Model<InferAttributes<ConnectionProfiles>, InferCreationAttributes<ConnectionProfiles>> {
    declare id?: CreationOptional<number>;
    declare name: string;
    declare queues: CreationOptional<object>;
    declare chatbot_id: ForeignKey<Chatbot['id']>;
    declare user_id: ForeignKey<User['id']>;
    declare default_messages: CreationOptional<object>;
    declare comments: CreationOptional<string>;
    declare params: CreationOptional<object>;

    declare getChatbot: HasOneGetAssociationMixin<Chatbot>; // Note the null assertions!
    declare setChatbot: HasOneSetAssociationMixin<Chatbot, number>;
    declare createChatbot: HasOneCreateAssociationMixin<Chatbot>;
    declare chatbot?: NonAttribute<Chatbot>;

    static associate() {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
        this.hasOne(Chatbot, { foreignKey: 'id', as: 'chatbot' });
    }
}

ConnectionProfiles.init(
    {
        name: DataTypes.STRING,
        queues: DataTypes.JSON,
        chatbot_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        default_messages: DataTypes.JSON,
        params: DataTypes.JSON,
        comments: DataTypes.STRING
    },
    { sequelize: SequelizeConnection }
);

//Connection.sync();
