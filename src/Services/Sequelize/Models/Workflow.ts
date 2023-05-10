import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { User } from './User';
export class Workflow extends Model<InferAttributes<Workflow>, InferCreationAttributes<Workflow>> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare user_id: ForeignKey<User['id']>;
  declare data: CreationOptional<object>;
  declare comments: CreationOptional<string>;
  declare params: CreationOptional<object>;

  static associate() {
    this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  }
}

Workflow.init(
  {
    name: DataTypes.STRING,
    data: DataTypes.JSON,
    user_id: DataTypes.INTEGER,
    comments: DataTypes.STRING,
    params: DataTypes.JSON
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
