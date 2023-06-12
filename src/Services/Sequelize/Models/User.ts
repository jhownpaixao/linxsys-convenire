import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { Environment } from './Environment';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare pass: string;
  declare env_id: ForeignKey<Environment['id']>;
  declare email: string;
  declare picture: string;
  declare uniqkey: string;
  declare auth_token: CreationOptional<string>;
  declare type: string;
  declare blocked: string;
  declare block_with_venc: string;
  declare group_id: CreationOptional<number>;
  declare date_venc: Date;
  declare loged_at: CreationOptional<Date>;
  declare params: CreationOptional<object>;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
  }
}

User.init(
  {
    name: DataTypes.STRING,
    env_id: DataTypes.INTEGER,
    pass: DataTypes.STRING,
    email: DataTypes.STRING,
    picture: DataTypes.STRING,
    uniqkey: DataTypes.STRING,
    type: DataTypes.STRING,
    blocked: DataTypes.STRING,
    block_with_venc: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    date_venc: DataTypes.DATE,
    loged_at: DataTypes.DATE,
    auth_token: DataTypes.STRING,
    params: DataTypes.JSON
  },
  {
    sequelize: SequelizeConnection,
    defaultScope: {
      attributes: { exclude: ['pass', 'auth_token'] }
    },
    scopes: {
      fullData: {
        attributes: [
          'id',
          'env_id',
          'name',
          'pass',
          'email',
          'uniqkey',
          'picture',
          'loged_at',
          'type',
          'block_with_venc',
          'group_id',
          'auth_token',
          'date_venc',
          'params',
          'createdAt',
          'updatedAt'
        ]
      }
    }
  }
);

//User.sync();
