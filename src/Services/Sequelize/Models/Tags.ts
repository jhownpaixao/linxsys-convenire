import { SequelizeConnection } from '../Database';
import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, ForeignKey } from 'sequelize';
import { User } from './User';
export class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
    declare id?: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']>;
    declare name: string;
    declare color: string;
    declare comments: CreationOptional<string>;
    declare params: CreationOptional<object>;

    static associate() {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    }
}

Tag.init(
    {
        name: DataTypes.STRING,
        color: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        comments: DataTypes.STRING,
        params: DataTypes.JSON
    },
    { sequelize: SequelizeConnection }
);

//Workflow.sync();
