import { SequelizeConnection } from '../Core';
import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, Model, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey,
} from 'sequelize';
import { Attendant } from './Attendant';
import { Client } from './Clients';
import { Connection } from './Connections';

import { uuid } from "uuidv4";
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id?: CreationOptional<number>;
    declare name: string;
    declare pass: string;
    declare email: string;
    uniqkey: CreationOptional<string> = uuid();
    declare type: string;
    declare block_with_venc: string;
    declare group_id: CreationOptional<number>;
    declare date_venc: Date;
    declare params: CreationOptional<object>;


    declare getAttendant: HasManyGetAssociationsMixin<Attendant>; // Note the null assertions!
    declare addAttendant: HasManyAddAssociationMixin<Attendant, number>;
    declare addAttendants: HasManyAddAssociationsMixin<Attendant, number>;
    declare setAttendants: HasManySetAssociationsMixin<Attendant, number>;
    declare removeAttendant: HasManyRemoveAssociationMixin<Attendant, number>;
    declare removeAttendants: HasManyRemoveAssociationsMixin<Attendant, number>;
    declare hasAttendant: HasManyHasAssociationMixin<Attendant, number>;
    declare hasAttendants: HasManyHasAssociationsMixin<Attendant, number>;
    declare countAttendants: HasManyCountAssociationsMixin;
    declare createAttendant: HasManyCreateAssociationMixin<Attendant, 'user_id'>;
    declare attendants?: NonAttribute<Attendant[]>; // Note this is optional since it's only populated when explicitly requested in code

    declare getClient: HasManyGetAssociationsMixin<Client>; // Note the null assertions!
    declare addClient: HasManyAddAssociationMixin<Client, number>;
    declare addClients: HasManyAddAssociationsMixin<Client, number>;
    declare setClients: HasManySetAssociationsMixin<Client, number>;
    declare removeClient: HasManyRemoveAssociationMixin<Client, number>;
    declare removeClients: HasManyRemoveAssociationsMixin<Client, number>;
    declare hasClient: HasManyHasAssociationMixin<Client, number>;
    declare hasClients: HasManyHasAssociationsMixin<Client, number>;
    declare countClients: HasManyCountAssociationsMixin;
    declare createClient: HasManyCreateAssociationMixin<Client, 'user_id'>;
    declare clients?: NonAttribute<Client[]>; // Note this is optional since it's only populated when explicitly requested in code

    declare getConnection: HasManyGetAssociationsMixin<Connection>; // Note the null assertions!
    declare addConnection: HasManyAddAssociationMixin<Connection, number>;
    declare addConnections: HasManyAddAssociationsMixin<Connection, number>;
    declare setConnections: HasManySetAssociationsMixin<Connection, number>;
    declare removeConnection: HasManyRemoveAssociationMixin<Connection, number>;
    declare removeConnections: HasManyRemoveAssociationsMixin<Connection, number>;
    declare hasConnection: HasManyHasAssociationMixin<Connection, number>;
    declare hasConnections: HasManyHasAssociationsMixin<Connection, number>;
    declare countConnections: HasManyCountAssociationsMixin;
    declare createConnection: HasManyCreateAssociationMixin<Connection, 'user_id'>;
    declare connections?: NonAttribute<Connection[]>; // Note this is optional since it's only populated when explicitly requested in code


    static associate(models: any) {
        this.hasMany(Attendant, { foreignKey: 'user_id', as: 'attendants' });
        this.hasMany(Client, { foreignKey: 'user_id', as: 'clients' });
        this.hasMany(Connection, { foreignKey: 'user_id', as: 'connections' });
    }
}

User.init({
    name: DataTypes.STRING,
    pass: DataTypes.STRING,
    email: DataTypes.STRING,
    uniqkey: DataTypes.STRING,
    type: DataTypes.STRING,
    block_with_venc: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    date_venc: DataTypes.DATE,
    params: DataTypes.JSON
}, { sequelize: SequelizeConnection });


//User.sync();