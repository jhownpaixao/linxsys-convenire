import { SequelizeConnection } from '../../Core';
import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, ForeignKey, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from 'sequelize';
import { uuid } from "uuidv4";
import { User } from '../User';
export class ClientGroup extends Model<InferAttributes<ClientGroup>, InferCreationAttributes<ClientGroup>> {

    declare id?: CreationOptional<number>;
    declare name: string;
    declare queues: CreationOptional<object>;
    declare user_id: ForeignKey<User['id']>;
    declare comments: CreationOptional<string>;
    declare params: CreationOptional<object>;

    declare getUser: BelongsToGetAssociationMixin<User>; // Note the null assertions!
    declare setUser: BelongsToSetAssociationMixin<User, number>;

    static associate(models: any) {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    }
}

ClientGroup.init({
    name: DataTypes.STRING,
    queues: DataTypes.JSON,
    user_id: DataTypes.INTEGER,
    comments: DataTypes.STRING,
    params: DataTypes.JSON,
}, { sequelize: SequelizeConnection });

//ClientGroup.sync();