import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  EnumDataType
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Environment } from './Environment';
import { Chat } from './Chat';
export class ChatMessage extends Model<
  InferAttributes<ChatMessage>,
  InferCreationAttributes<ChatMessage>
> {
  declare id?: CreationOptional<number>;
  declare env_id: ForeignKey<Environment['id']>;
  declare chat_id: ForeignKey<Chat['id']>;
  declare uniqkey: string;
  declare from: number;
  declare text: string;
  declare level: EnumDataType<'default' | 'system' | 'other'>;
  declare type: EnumDataType<'default' | 'media' | 'link' | 'action'>;
  declare status: EnumDataType<'waiting' | 'sent' | 'received' | 'deleted' | 'error'>;
  declare actions: EnumDataType<'default' | 'forwarded'>;
  declare receivedby: CreationOptional<object>;
  declare readby: CreationOptional<object>;
  declare attachment: CreationOptional<object>;
  declare reactions: CreationOptional<object>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
    this.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });
  }
}

ChatMessage.init(
  {
    env_id: DataTypes.INTEGER,
    chat_id: DataTypes.INTEGER,
    uniqkey: DataTypes.STRING,
    from: DataTypes.INTEGER,
    text: DataTypes.STRING,
    level: DataTypes.ENUM('default', 'system', 'other'),
    type: DataTypes.ENUM('default', 'media', 'link', 'action'),
    status: DataTypes.ENUM('waiting', 'sent', 'received', 'deleted', 'error'),
    actions: DataTypes.ENUM('default', 'forwarded'),
    receivedby: DataTypes.JSON,
    readby: DataTypes.JSON,
    attachment: DataTypes.JSON,
    reactions: DataTypes.JSON
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
