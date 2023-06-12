import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Chatbot } from './Chatbot';
import { Environment } from './Environment';
export class ConnectionProfiles extends Model<
  InferAttributes<ConnectionProfiles>,
  InferCreationAttributes<ConnectionProfiles>
> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare queues: CreationOptional<object>;
  declare chatbot_id: ForeignKey<Chatbot['id']>;
  declare env_id: ForeignKey<Environment['id']>;
  declare default_messages: CreationOptional<object>;
  declare comments: CreationOptional<string>;
  declare params: CreationOptional<object>;

  declare getChatbot: BelongsToGetAssociationMixin<Chatbot>;
  declare setChatbot: BelongsToSetAssociationMixin<Chatbot, ForeignKey<Chatbot['id']>>;
  declare createChatbot: BelongsToCreateAssociationMixin<Chatbot>;
  declare chatbot?: NonAttribute<Chatbot>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
    this.belongsTo(Chatbot, { foreignKey: 'chatbot_id', as: 'chatbot' });
  }
}

ConnectionProfiles.init(
  {
    name: DataTypes.STRING,
    queues: DataTypes.JSON,
    chatbot_id: DataTypes.INTEGER,
    env_id: DataTypes.INTEGER,
    default_messages: DataTypes.JSON,
    params: DataTypes.JSON,
    comments: DataTypes.STRING
  },
  { sequelize: SequelizeConnection }
);

//Connection.sync();
