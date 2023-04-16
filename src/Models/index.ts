import { User } from './User';
import { Attendant } from './Attendant';
import { Client, ClientGroup, Contact } from './Clients';
import { Connection, ConnectionsConfigs } from './Connections';

/* const Models = SequelizeConnection.models; */
const Models = {
    Attendant,
    User,
    Client,
    ClientGroup,
    Contact,
    Connection,
    ConnectionsConfigs
};
Attendant.associate();
User.associate();
Client.associate();
ClientGroup.associate();
Contact.associate();
Connection.associate();
ConnectionsConfigs.associate();

export {
    Attendant as AttendantModel,
    User as UserModel,
    Client as ClientModel,
    ClientGroup as ClientGroupModel,
    Contact as ContactModel,
    Connection as ConnectionModel,
    ConnectionsConfigs as ConnectionsConfigsModel,
    Models
};
