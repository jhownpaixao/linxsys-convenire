import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { User } from './User';

export class Resource extends Model<InferAttributes<Resource>, InferCreationAttributes<Resource>> {
  declare id?: CreationOptional<number>;
  declare user_id: ForeignKey<User['id']>;
  declare name: string;
  declare comments: CreationOptional<string>;

  static associate() {
    this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  }
}

Resource.init(
  {
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    comments: DataTypes.STRING
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
