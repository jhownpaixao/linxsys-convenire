import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneGetAssociationMixin
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Environment } from './Environment';
import { Connection } from './Connection';

export class Attendant extends Model<
  InferAttributes<Attendant>,
  InferCreationAttributes<Attendant>
> {
  declare id?: CreationOptional<number>;
  declare env_id: ForeignKey<Environment['id']>;
  declare user?: NonAttribute<Environment>;
  declare name: string;
  declare picture: string;
  declare pass: string;
  declare email: string;
  declare uniqkey: string;
  declare block_with_venc: string;
  declare group_id: CreationOptional<number>;
  declare default_conn: CreationOptional<ForeignKey<Connection['id']>>;
  declare params: CreationOptional<object>;

  declare getEnvironment: BelongsToGetAssociationMixin<Environment>; // Note the null assertions!
  declare setEnvironment: BelongsToSetAssociationMixin<Environment, number>;

  declare getConnection: HasOneGetAssociationMixin<Connection>; // Note the null assertions!
  declare setConnection: HasOneSetAssociationMixin<Connection, number>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'user_id', as: 'environment' });
    this.hasOne(Connection, { foreignKey: 'id', as: 'connection' });
  }
}

Attendant.init(
  {
    env_id: DataTypes.INTEGER.UNSIGNED,
    name: DataTypes.STRING,
    picture: DataTypes.STRING,
    pass: DataTypes.STRING,
    email: DataTypes.STRING,
    uniqkey: DataTypes.STRING,
    block_with_venc: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    default_conn: DataTypes.INTEGER,
    params: DataTypes.JSON
  },
  {
    sequelize: SequelizeConnection,
    defaultScope: {
      attributes: { exclude: ['pass', 'uniqkey', 'params'] }
    },
    scopes: {
      fullData: {
        attributes: [
          'id',
          'name',
          'pass',
          'email',
          'uniqkey',
          'default_conn',
          'block_with_venc',
          'group_id',
          'date_venc',
          'params',
          'createdAt',
          'updatedAt',
          'user_id'
        ]
      }
    }
  }
);

// Attendant.sync();
