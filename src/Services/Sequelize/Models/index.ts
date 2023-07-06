import { Assessment } from './Assessment';
import { Attendant } from './Attendant';
import { Campaing } from './Campaing';
import { Chat } from './Chat';
import { ChatMessage } from './ChatMessage';
import { Chatbot } from './Chatbot';
import { Client } from './Client';
import { ClientGroup } from './ClientGroup';
import { Connection } from './Connection';
import { ConnectionProfiles } from './ConnectionProfile';
import { Contact } from './Contact';
import { Environment } from './Environment';
import { Event } from './Event';
import { Queue } from './Queue';
import { Resource } from './Resource';
import { Tag } from './Tag';
import { Ticket } from './Ticket';
import { User } from './User';
import { Workflow } from './Workflow';

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
  Tag,
  Chat,
  ChatMessage,
  Queue,
  Ticket,
  Assessment,
  Event,
  Resource,
  Environment,
  Campaing
};

Object.values(Models).map((model) => model.associate());

export {
  Assessment as AssessmentModel,
  Attendant as AttendantModel,
  ChatMessage as ChatMessageModel,
  Chat as ChatModel,
  Chatbot as ChatbotModel,
  ClientGroup as ClientGroupModel,
  Connection as ConnectionModel,
  ConnectionProfiles as ConnectionProfilesModel,
  Contact as ContactModel,
  Client as CustomerModel,
  Environment as EnvironmentModel,
  Event as EventModel,
  Models,
  Queue as QueueModel,
  Resource as ResourceModel,
  Tag as TagModel,
  Ticket as TicketModel,
  User as UserModel,
  Workflow as WorkflowModel,
  Campaing as CampaingModel
};
