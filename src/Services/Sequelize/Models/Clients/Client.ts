import { SequelizeConnection } from '../../Database';
import {
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationsMixin,
    HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
    ForeignKey
} from 'sequelize';

import { User } from '../User';
import { ClientGroup } from './ClientGroup';
import { Contact } from './Contact';

export class Client extends Model<InferAttributes<Client>, InferCreationAttributes<Client>> {
    declare id?: CreationOptional<number>;
    declare nome: string;
    declare user_id: ForeignKey<User['id']>;
    declare nascimento: CreationOptional<string>;
    declare email: CreationOptional<string>;
    declare cpf: CreationOptional<string>;
    declare rg: CreationOptional<string>;
    declare cep: CreationOptional<string>;
    declare end: CreationOptional<string>;
    declare end_num: CreationOptional<string>;
    declare bairro: CreationOptional<string>;
    declare cidade: CreationOptional<string>;
    declare uf: CreationOptional<string>;
    declare group_id: ForeignKey<ClientGroup['id']>;
    declare params: CreationOptional<object>;

    declare getContacts: HasManyGetAssociationsMixin<Contact>; // Note the null assertions!
    declare addContact: HasManyAddAssociationMixin<Contact, number>;
    declare addContacts: HasManyAddAssociationsMixin<Contact, number>;
    declare setContacts: HasManySetAssociationsMixin<Contact, number>;
    declare removeContact: HasManyRemoveAssociationMixin<Contact, number>;
    declare removeContacts: HasManyRemoveAssociationsMixin<Contact, number>;
    declare hasContact: HasManyHasAssociationMixin<Contact, number>;
    declare hasContacts: HasManyHasAssociationsMixin<Contact, number>;
    declare countContacts: HasManyCountAssociationsMixin;
    declare createContact: HasManyCreateAssociationMixin<Contact, 'client_id'>;
    declare contacts?: NonAttribute<Contact[]>; // Note this is optional since it's only populated when explicitly requested in code

    static associate() {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
        this.hasOne(ClientGroup, { foreignKey: 'id', as: 'group' });
        this.hasMany(Contact, { foreignKey: 'client_id', as: 'contacts' });
    }
}

Client.init(
    {
        nome: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        nascimento: DataTypes.STRING,
        email: DataTypes.STRING,
        cpf: DataTypes.STRING,
        rg: DataTypes.STRING,
        cep: DataTypes.STRING,
        end: DataTypes.STRING,
        end_num: DataTypes.STRING,
        bairro: DataTypes.STRING,
        cidade: DataTypes.STRING,
        uf: DataTypes.STRING,
        group_id: DataTypes.INTEGER,
        params: DataTypes.JSON
    },
    { sequelize: SequelizeConnection }
);

//Client.sync();
