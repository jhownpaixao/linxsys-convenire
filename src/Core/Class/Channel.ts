import type { IUser } from '@core/types/User';
import type { Drivers } from '@core/types/Driver';

type Types = 'chat' | 'voip';

interface IChannel {
  type: Types;
  driver: Drivers;
  address: string;

  /* Methods */
  connect: () => void;
  close: () => void;
  create: () => IChannel;

  send: (payload: unknown) => void;
  receive: (payload: unknown) => void;
  call: () => void;
}

export interface Attendance {
  channel: IChannel;
  ticket: ITicket;
  attendant: IUser;
  queue: IQueue;

  start: () => void;
  finish: () => void;
}

export class Channel implements IChannel {
  type: Types;
  driver: Drivers;
  address: string;

  constructor(type: Types, driver: Drivers) {
    this.driver = driver;
    this.type = type;
  }

  async connect() {
    const address = await this.driver.connect();
    this.address = address;
  }

  async send(payload: unknown) {
    await this.driver.send(payload);
  }

  close: () => void;
  create: () => IChannel;
  receive: () => void;
  call: () => void;
}
