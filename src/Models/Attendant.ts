import { SequelizeConnection } from '../Core';
import {
    Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, ForeignKey, NonAttribute,
    BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin,
    HasOneCreateAssociationMixin, HasOneSetAssociationMixin, HasOneGetAssociationMixin
} from 'sequelize';
import { uuid } from "uuidv4";
import { User } from './User';
import { Connection } from './Connections';

export class Attendant extends Model<InferAttributes<Attendant>, InferCreationAttributes<Attendant>> {
    declare id?: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']>;
    declare user?: NonAttribute<User>;
    declare name: string;
    declare pass: string;
    declare email: string;
    declare uniqkey: string
    declare block_with_venc: string;
    declare group_id: CreationOptional<number>;
    declare default_conn: CreationOptional<ForeignKey<Connection['id']>>;
    declare params: CreationOptional<object>;

    declare getUser: BelongsToGetAssociationMixin<User>; // Note the null assertions!
    declare setUser: BelongsToSetAssociationMixin<User, number>;

    declare getConnection: HasOneGetAssociationMixin<Connection>; // Note the null assertions!
    declare setConnection: HasOneSetAssociationMixin<Connection, number>;

    static associate(models: any) {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
        this.hasOne(Connection, { foreignKey: 'id', as: 'connection' })
    }
}


Attendant.init({
    user_id: DataTypes.INTEGER.UNSIGNED,
    name: DataTypes.STRING,
    pass: DataTypes.STRING,
    email: DataTypes.STRING,
    uniqkey: DataTypes.STRING,
    block_with_venc: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    default_conn: DataTypes.INTEGER,
    params: DataTypes.JSON
}, { sequelize: SequelizeConnection });

// Attendant.sync();