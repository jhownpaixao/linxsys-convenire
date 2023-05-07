import { SequelizeConnection } from '../Database';
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    DataTypes,
    CreationOptional,
    ForeignKey,
    NonAttribute,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    HasOneSetAssociationMixin,
    HasOneGetAssociationMixin
} from 'sequelize';
import { User } from './User';
import { Connection } from './Connections';

export class Attendant extends Model<InferAttributes<Attendant>, InferCreationAttributes<Attendant>> {
    declare id?: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']>;
    declare user?: NonAttribute<User>;
    declare name: string;
    declare pass: string;
    declare email: string;
    declare uniqkey: string;
    declare block_with_venc: string;
    declare group_id: CreationOptional<number>;
    declare default_conn: CreationOptional<ForeignKey<Connection['id']>>;
    declare params: CreationOptional<object>;

    declare getUser: BelongsToGetAssociationMixin<User>; // Note the null assertions!
    declare setUser: BelongsToSetAssociationMixin<User, number>;

    declare getConnection: HasOneGetAssociationMixin<Connection>; // Note the null assertions!
    declare setConnection: HasOneSetAssociationMixin<Connection, number>;

    static associate() {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
        this.hasOne(Connection, { foreignKey: 'id', as: 'connection' });
    }
}

Attendant.init(
    {
        user_id: DataTypes.INTEGER.UNSIGNED,
        name: DataTypes.STRING,
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
