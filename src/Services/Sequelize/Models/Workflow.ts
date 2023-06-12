import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Environment } from './Environment';
export class Workflow extends Model<InferAttributes<Workflow>, InferCreationAttributes<Workflow>> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare env_id: ForeignKey<Environment['id']>;
  declare data: CreationOptional<object>;
  declare comments: CreationOptional<string>;
  declare params: CreationOptional<object>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
  }
}

Workflow.init(
  {
    name: DataTypes.STRING,
    data: DataTypes.JSON,
    env_id: DataTypes.INTEGER,
    comments: DataTypes.STRING,
    params: DataTypes.JSON
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
