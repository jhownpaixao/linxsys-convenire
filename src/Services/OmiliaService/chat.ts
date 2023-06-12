import type * as types from './types';

export default class Chat implements types.IChat {
  uniqkey: string;
  owners: types.TMessageUserTrace[];
  participants: types.TMessageUserTrace[];
  channel: string;
  type: types.EChatType;
  title?: string;
  params?: object;
  messages?: types.IMessage[];
  sendMessage(message: types.IMessage): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  receiveMessage(message: types.IMessage): Promise<types.IMessage> {
    throw new Error('Method not implemented.');
  }
  reactToMessage(message: types.IMessage): Promise<types.IMessage> {
    throw new Error('Method not implemented.');
  }
  forwardMessage(message: types.IMessage): Promise<types.IMessage> {
    throw new Error('Method not implemented.');
  }
  deleteMessage(message: types.IMessage): Promise<void> {
    throw new Error('Method not implemented.');
  }
  rename(name: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  delete(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  create(): Promise<this> {
    throw new Error('Method not implemented.');
  }
  getOwner(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setOwner(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  removeOwner(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  join(participant: types.TMessageUserTrace): Promise<this> {
    throw new Error('Method not implemented.');
  }
  left(participant: types.TMessageUserTrace): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getParticipant(): Promise<types.TMessageUserTrace> {
    throw new Error('Method not implemented.');
  }
  listParticipants(): Promise<types.TMessageUserTrace[]> {
    throw new Error('Method not implemented.');
  }
}
