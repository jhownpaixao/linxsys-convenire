import { SequelizeConnection } from '../Database';
import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, ForeignKey } from 'sequelize';
import { Client } from './Client';
import { User } from './User';

export class Contact extends Model<InferAttributes<Contact>, InferCreationAttributes<Contact>> {
    declare id?: CreationOptional<number>;
    declare value: string;
    declare user_id: ForeignKey<User['id']>;
    declare client_id: ForeignKey<Client['id']>;
    declare comments: CreationOptional<string>;
    declare params: CreationOptional<object>;

    static associate() {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
    }
}

Contact.init(
    {
        value: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        client_id: DataTypes.INTEGER,
        comments: DataTypes.STRING,
        params: DataTypes.JSON
    },
    { sequelize: SequelizeConnection }
);

//Contact.sync();
