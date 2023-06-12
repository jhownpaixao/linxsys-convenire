import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Environment } from './Environment';
import type { Client } from './Client';
import type { Contact } from './Contact';
export class Assessment extends Model<
  InferAttributes<Assessment>,
  InferCreationAttributes<Assessment>
> {
  declare id?: CreationOptional<number>;
  declare env_id: ForeignKey<Environment['id']>;
  declare client_id: ForeignKey<Client['id']>;
  declare contact_id: ForeignKey<Contact['id']>;
  declare for_id: number;
  declare comments: CreationOptional<string>;
  declare note: number;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(Environment, { foreignKey: 'client_id', as: 'client' });
    this.belongsTo(Environment, { foreignKey: 'contact_id', as: 'contact' });
  }
}

Assessment.init(
  {
    env_id: DataTypes.INTEGER,
    client_id: DataTypes.INTEGER,
    contact_id: DataTypes.INTEGER,
    for_id: DataTypes.INTEGER,
    comments: DataTypes.STRING,
    note: DataTypes.INTEGER
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
