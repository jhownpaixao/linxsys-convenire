import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Client } from './Client';
import { Environment } from './Environment';

export class Contact extends Model<InferAttributes<Contact>, InferCreationAttributes<Contact>> {
  declare id?: CreationOptional<number>;
  declare value: string;
  declare env_id: ForeignKey<Environment['id']>;
  declare client_id: ForeignKey<Client['id']>;
  declare comments: CreationOptional<string>;
  declare params: CreationOptional<object>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
    this.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
  }
}

Contact.init(
  {
    value: DataTypes.STRING,
    env_id: DataTypes.INTEGER,
    client_id: DataTypes.INTEGER,
    comments: DataTypes.STRING,
    params: DataTypes.JSON
  },
  { sequelize: SequelizeConnection }
);

//Contact.sync();
