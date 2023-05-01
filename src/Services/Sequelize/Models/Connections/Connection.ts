import { SequelizeConnection } from '../../Database';
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    DataTypes,
    CreationOptional,
    ForeignKey,
    HasOneCreateAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin
} from 'sequelize';
import { ConnectionsConfigs } from './ConnectionsConfigs';
import { User } from '../User';

export class Connection extends Model<InferAttributes<Connection>, InferCreationAttributes<Connection>> {
    declare id?: CreationOptional<number>;
    declare name: string;
    declare connected_id?: CreationOptional<string>;
    declare uniqkey: string;
    declare user_id: ForeignKey<User['id']>;
    declare config_id: ForeignKey<ConnectionsConfigs['id']>;
    declare type: number;
    declare params: CreationOptional<object>;
    declare comments: CreationOptional<string>;

    declare getConfig: HasOneGetAssociationMixin<ConnectionsConfigs>; // Note the null assertions!
    declare setConfig: HasOneSetAssociationMixin<ConnectionsConfigs, number>;
    declare createConfig: HasOneCreateAssociationMixin<ConnectionsConfigs>;

    static associate() {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
        this.hasOne(ConnectionsConfigs, { foreignKey: 'id', as: 'Config' });
    }
}

Connection.init(
    {
        name: DataTypes.STRING,
        uniqkey: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        type: DataTypes.INTEGER,
        config_id: DataTypes.INTEGER,
        params: DataTypes.JSON,
        comments: DataTypes.STRING
    },
    { sequelize: SequelizeConnection }
);

//Connection.sync();
