import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Environment } from './Environment';

export class Campaing extends Model<InferAttributes<Campaing>, InferCreationAttributes<Campaing>> {
  declare id?: CreationOptional<number>;
  declare env_id: ForeignKey<Environment['id']>;
  declare name: string;
  declare owner_id: number;
  declare type: number;
  declare params: any;
  declare comments: CreationOptional<string>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
  }
}

Campaing.init(
  {
    env_id: DataTypes.INTEGER,
    owner_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    params: DataTypes.STRING,
    comments: DataTypes.STRING
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
