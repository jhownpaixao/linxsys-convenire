import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Environment } from './Environment';
export class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
  declare id?: CreationOptional<number>;
  declare env_id: ForeignKey<Environment['id']>;
  declare name: string;
  declare color: string;
  declare comments: CreationOptional<string>;
  declare params: CreationOptional<object>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
  }
}

Tag.init(
  {
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    env_id: DataTypes.INTEGER,
    comments: DataTypes.STRING,
    params: DataTypes.JSON
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
