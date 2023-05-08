import { SequelizeConnection } from '../Database';
import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, ForeignKey } from 'sequelize';
import { User } from './User';

export class Queue extends Model<InferAttributes<Queue>, InferCreationAttributes<Queue>> {
    declare id?: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']>;
    declare name: string;
    declare params: CreationOptional<object>;
    declare comments: CreationOptional<string>;

    static associate() {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    }
}

Queue.init(
    {
        name: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        comments: DataTypes.STRING,
        params: DataTypes.JSON
    },
    { sequelize: SequelizeConnection }
);

//Workflow.sync();
