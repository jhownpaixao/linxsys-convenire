import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { User } from './User';
import type { Client } from './Client';
import type { Contact } from './Contact';
export class Assessment extends Model<
  InferAttributes<Assessment>,
  InferCreationAttributes<Assessment>
> {
  declare id?: CreationOptional<number>;
  declare user_id: ForeignKey<User['id']>;
  declare client_id: ForeignKey<Client['id']>;
  declare contact_id: ForeignKey<Contact['id']>;
  declare for_id: number;
  declare comments: CreationOptional<string>;
  declare note: number;

  static associate() {
    this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
    this.belongsTo(User, { foreignKey: 'contact_id', as: 'contact' });
  }
}

Assessment.init(
  {
    user_id: DataTypes.INTEGER,
    client_id: DataTypes.INTEGER,
    contact_id: DataTypes.INTEGER,
    for_id: DataTypes.INTEGER,
    comments: DataTypes.STRING,
    note: DataTypes.INTEGER
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
