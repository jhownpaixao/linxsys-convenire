import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Environment } from './Environment';
export class ClientGroup extends Model<
  InferAttributes<ClientGroup>,
  InferCreationAttributes<ClientGroup>
> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare queues: CreationOptional<object>;
  declare env_id: ForeignKey<Environment['id']>;
  declare comments: CreationOptional<string>;
  declare params: CreationOptional<object>;

  declare getEnvironment: BelongsToGetAssociationMixin<Environment>; // Note the null assertions!
  declare setEnvironment: BelongsToSetAssociationMixin<Environment, number>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
  }
}

ClientGroup.init(
  {
    name: DataTypes.STRING,
    queues: DataTypes.JSON,
    env_id: DataTypes.INTEGER,
    comments: DataTypes.STRING,
    params: DataTypes.JSON
  },
  { sequelize: SequelizeConnection }
);

//ClientGroup.sync();
