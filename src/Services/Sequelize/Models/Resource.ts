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
  declare type: number;
  declare params: any;
  declare comments: CreationOptional<string>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
  }
}

Resource.init(
  {
    env_id: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    params: DataTypes.STRING,
    comments: DataTypes.STRING
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
