import { SequelizeConnection } from '../../Core';
import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, ForeignKey } from 'sequelize';
import { uuid } from "uuidv4";
import { Client } from './Client';
export class Contact extends Model<InferAttributes<Contact>, InferCreationAttributes<Contact>> {

    declare id?: CreationOptional<number>;
    declare value: string;
    declare client_id: ForeignKey<Client['id']>;
    declare comments: CreationOptional<string>;
    declare params: CreationOptional<object>;



    static associate(models: any) {
        this.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
    }
}

Contact.init({
    value: DataTypes.STRING,
    client_id: DataTypes.INTEGER,
    comments: DataTypes.STRING,
    params: DataTypes.JSON,
}, { sequelize: SequelizeConnection });

//Contact.sync();