import { SequelizeConnection } from '../Utils/DataBase';
import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { uuid } from "uuidv4";


export declare interface AttendantParams {
    user_id: number
    name: string;
    pass: string;
    email: string;
    uniqkey?: string;
    block_with_venc?: string;
    group_id?: number;
    default_conn?: number;
    data?: object;
}


export default class Attendant extends Model<InferAttributes<Attendant>, InferCreationAttributes<Attendant>> {

    user_id!: number
    name!: string;
    pass!: string;
    email!: string;
    uniqkey?: string = uuid();
    block_with_venc?: string;
    group_id?: number;
    default_conn?: number;
    data?: object;

    static associate(models: any) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });

    }
}

Attendant.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    pass: DataTypes.STRING,
    email: DataTypes.STRING,
    uniqkey: DataTypes.UUIDV4,
    block_with_venc: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    default_conn: DataTypes.INTEGER,
    data: DataTypes.JSON
}, { sequelize: SequelizeConnection });

