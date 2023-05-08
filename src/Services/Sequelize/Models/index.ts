import { User } from './User';
import { Attendant } from './Attendant';
import { Chatbot } from './Chatbot';
import { Workflow } from './Workflow';
import { Client } from './Client';
import { ClientGroup } from './ClientGroup';
import { Contact } from './Contact';
import { Connection } from './Connection';
import { ConnectionProfiles } from './ConnectionProfile';
import { Tag } from './Tag';

const Models = {
    Attendant,
    User,
    Client,
    ClientGroup,
    Contact,
    Connection,
    ConnectionProfiles,
    Chatbot,
    Workflow,
    Tag
};

Object.values(Models).map((model) => model.associate());

export {
    Attendant as AttendantModel,
    User as UserModel,
    Client as CustomerModel,
    ClientGroup as ClientGroupModel,
    Contact as ContactModel,
    Connection as ConnectionModel,
    ConnectionProfiles as ConnectionProfilesModel,
    Chatbot as ChatbotModel,
    Workflow as WorkflowModel,
    Tag as TagModel,
    Models
};
