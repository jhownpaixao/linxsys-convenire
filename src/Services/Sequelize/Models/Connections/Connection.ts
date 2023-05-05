import { SequelizeConnection } from '../../Database';
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    DataTypes,
    CreationOptional,
    ForeignKey,
    NonAttribute,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin
} from 'sequelize';
import { ConnectionProfiles } from './ConnectionProfiles';
import { User } from '../User';

export class Connection extends Model<InferAttributes<Connection>, InferCreationAttributes<Connection>> {
    declare id?: CreationOptional<number>;
    declare name: string;
    declare connected_id?: CreationOptional<string>;
    declare uniqkey: string;
    declare user_id: ForeignKey<User['id']>;
    declare config_id: ForeignKey<ConnectionProfiles['id']>;
    declare type: number;
    declare params: CreationOptional<object>;
    declare comments: CreationOptional<string>;

    declare getProfile: BelongsToGetAssociationMixin<ConnectionProfiles>;
    declare setProfile: BelongsToSetAssociationMixin<ConnectionProfiles, ForeignKey<ConnectionProfiles['id']>>;
    declare createProfile: BelongsToCreateAssociationMixin<ConnectionProfiles>;
    declare profile?: NonAttribute<ConnectionProfiles>;

    static associate() {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(ConnectionProfiles, { foreignKey: 'config_id', as: 'profile' });
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
