import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Environment } from './Environment';

export class Resource extends Model<InferAttributes<Resource>, InferCreationAttributes<Resource>> {
  declare id?: CreationOptional<number>;
  declare env_id: ForeignKey<Environment['id']>;
  declare name: string;
  declare comments: CreationOptional<string>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
  }
}

Resource.init(
  {
    name: DataTypes.STRING,
    env_id: DataTypes.INTEGER,
    comments: DataTypes.STRING
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
