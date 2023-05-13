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
import { Chat } from './Chat';
import { ChatMessage } from './ChatMessage';
import { Queue } from './Queue';
import { Ticket } from './Ticket';
import { Assessment } from './Assessment';
import { Event } from './Event';
import { Resource } from './Resource';

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
  Resource
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
  Chat as ChatModel,
  ChatMessage as ChatMessageModel,
  Queue as QueueModel,
  Ticket as TicketModel,
  Assessment as AssessmentModel,
  Event as EventModel,
  Resource as ResourceModel,
  Models
};
