import { SequelizeConnection } from "../Core";
import { User as UserModel } from "./User";
import { Attendant as AttendantModel } from "./Attendant";
import {
    Client as ClientModel,
    ClientGroup as ClientGroupModel,
    Contact as ContactModel
} from './Clients'
import {
    Connection as ConnectionModel,
    ConnectionsConfigs as ConnectionsConfigsModel,
} from './Connections'

const Models = SequelizeConnection.models;

AttendantModel.associate(Models)
UserModel.associate(Models)
ClientModel.associate(Models)
ClientGroupModel.associate(Models)
ContactModel.associate(Models)
ConnectionModel.associate(Models)
ConnectionsConfigsModel.associate(Models)


export {
    AttendantModel,
    UserModel,
    ClientModel,
    ClientGroupModel,
    ContactModel,
    ConnectionModel,
    ConnectionsConfigsModel,
    Models
}