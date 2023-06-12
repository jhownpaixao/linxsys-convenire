import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Environment } from './Environment';

export class Queue extends Model<InferAttributes<Queue>, InferCreationAttributes<Queue>> {
  declare id?: CreationOptional<number>;
  declare env_id: ForeignKey<Environment['id']>;
  declare name: string;
  declare params: CreationOptional<object>;
  declare comments: CreationOptional<string>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
  }
}

Queue.init(
  {
    name: DataTypes.STRING,
    env_id: DataTypes.INTEGER,
    comments: DataTypes.STRING,
    params: DataTypes.JSON
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
