import { User } from './User';
import { Attendant } from './Attendant';
import { Chatbot } from './Chatbot';
import { Client, ClientGroup, Contact } from './Clients';
import { Connection, ConnectionProfiles } from './Connections';

/* const Models = SequelizeConnection.models; */
const Models = {
    Attendant,
    User,
    Client,
    ClientGroup,
    Contact,
    Connection,
    ConnectionProfiles,
    Chatbot
};
Attendant.associate();
User.associate();
Client.associate();
ClientGroup.associate();
Contact.associate();
Connection.associate();
ConnectionProfiles.associate();

export {
    Attendant as AttendantModel,
    User as UserModel,
    Client as CustomerModel,
    ClientGroup as ClientGroupModel,
    Contact as ContactModel,
    Connection as ConnectionModel,
    ConnectionProfiles as ConnectionProfilesModel,
    Chatbot as ChatbotModel,
    Models
};
