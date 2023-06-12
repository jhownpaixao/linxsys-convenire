import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { ConnectionProfiles } from './ConnectionProfile';
import { Environment } from './Environment';

export class Connection extends Model<
  InferAttributes<Connection>,
  InferCreationAttributes<Connection>
> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare connected_id?: CreationOptional<string>;
  declare uniqkey: string;
  declare env_id: ForeignKey<Environment['id']>;
  declare config_id: ForeignKey<ConnectionProfiles['id']>;
  declare type: number;
  declare params: CreationOptional<object>;
  declare comments: CreationOptional<string>;

  declare getProfile: BelongsToGetAssociationMixin<ConnectionProfiles>;
  declare setProfile: BelongsToSetAssociationMixin<
    ConnectionProfiles,
    ForeignKey<ConnectionProfiles['id']>
  >;
  declare createProfile: BelongsToCreateAssociationMixin<ConnectionProfiles>;
  declare profile?: NonAttribute<ConnectionProfiles>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
    this.belongsTo(ConnectionProfiles, { foreignKey: 'config_id', as: 'profile' });
  }
}

Connection.init(
  {
    name: DataTypes.STRING,
    uniqkey: DataTypes.STRING,
    env_id: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    config_id: DataTypes.INTEGER,
    params: DataTypes.JSON,
    comments: DataTypes.STRING
  },
  { sequelize: SequelizeConnection }
);

//Connection.sync();
