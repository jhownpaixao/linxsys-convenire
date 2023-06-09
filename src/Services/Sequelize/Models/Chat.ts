import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  EnumDataType,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Environment } from './Environment';
import { ChatMessage } from './ChatMessage';

export class Chat extends Model<InferAttributes<Chat>, InferCreationAttributes<Chat>> {
  declare id?: CreationOptional<number>;
  declare env_id: ForeignKey<Environment['id']>;
  declare owner_id: number;
  declare channel: string;
  declare title: string;
  declare params: CreationOptional<object>;
  declare type: EnumDataType<'group' | 'private'>;

  declare getMessages: HasManyGetAssociationsMixin<ChatMessage>; // Note the null assertions!
  declare addMessage: HasManyAddAssociationMixin<ChatMessage, number>;
  declare addMessages: HasManyAddAssociationsMixin<ChatMessage, number>;
  declare setMessages: HasManySetAssociationsMixin<ChatMessage, number>;
  declare removeMessage: HasManyRemoveAssociationMixin<ChatMessage, number>;
  declare removeMessages: HasManyRemoveAssociationsMixin<ChatMessage, number>;
  declare hasMessage: HasManyHasAssociationMixin<ChatMessage, number>;
  declare hasMessages: HasManyHasAssociationsMixin<ChatMessage, number>;
  declare countMessages: HasManyCountAssociationsMixin;
  declare createMessage: HasManyCreateAssociationMixin<ChatMessage, 'chat_id'>;
  declare messages?: NonAttribute<ChatMessage[]>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
    this.hasMany(ChatMessage, { foreignKey: 'chat_id', as: 'messages' });
  }
}

Chat.init(
  {
    env_id: DataTypes.INTEGER,
    owner_id: DataTypes.INTEGER,
    channel: DataTypes.STRING,
    title: DataTypes.STRING,
    params: DataTypes.JSON,
    type: DataTypes.ENUM('group', 'private')
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
