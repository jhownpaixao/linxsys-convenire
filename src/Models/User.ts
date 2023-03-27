import { SequelizeConnection } from '../Utils/DataBase';
import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { uuid } from "uuidv4";


export declare interface UserParams {
    name: string;
    pass: string;
    email: string;
    type: string;
    block_with_venc: string;
    group_id?: number;
    date_venc: Date;
    data?: object;
}

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    name!: string;
    pass!: string;
    email!: string;
    uniqkey?: string = uuid();
    type!: string;
    block_with_venc!: string;
    group_id?: number;
    date_venc!: Date;
    data?: object;

    static associate(models: any) {
        this.hasMany(models.Attendant, { foreignKey: 'user_id', as: 'attendants' });
    }
}

User.init({
    name: DataTypes.STRING,
    pass: DataTypes.STRING,
    email: DataTypes.STRING,
    uniqkey: DataTypes.UUIDV4,
    type: DataTypes.STRING,
    block_with_venc: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    date_venc: DataTypes.DATE,
    data: DataTypes.JSON
}, { sequelize: SequelizeConnection });