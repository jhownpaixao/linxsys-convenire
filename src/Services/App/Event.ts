import { HTTPResponseCode } from '@core/config';
import { AppProcessError } from '@core/utils';
import type { InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';
import type { MakeNullishOptional } from 'sequelize/types/utils';
import { logger } from '../Logger/Logger';
import { EventModel } from '../sequelize/Models';

interface IEventLog {
  description?: string;
  data?: any;
  owner_id: string;
  env_id: number;
  target: number;
  method: number;
  triggered_at: Date;
}

export enum EventLogMethod {
  created,
  updated,
  deleted,
  linked
}

export enum EventLogTarget {
  user = 100 * 10,
  attendant,
  assessment,
  chat,
  chatbot,
  message,
  customer,
  campaing,
  connection,
  connection_profile,
  contact,
  queued,
  tag,
  ticket,
  workflow,
  environment
}

export class EventLog {
  public owner: string;
  public env: number;

  private constructor(uniqkey: string, env_id?: number) {
    this.owner = uniqkey;
    this.env = env_id;
  }

  public static create(uniqkey: string, env_id?: number) {
    return new this(uniqkey, env_id);
  }

  public register(
    target: (typeof EventLogTarget)[keyof typeof EventLogTarget],
    method: (typeof EventLogMethod)[keyof typeof EventLogMethod],
    data?: any,
    description?: string
  ) {
    let d;
    switch (typeof data) {
      case 'object':
        d = JSON.parse(data);
        break;
      case 'number':
        d = String(data);
        break;
      case 'string':
        d = data;
        break;
    }
    const logEvent: IEventLog = {
      description,
      data: d,
      target,
      method,
      env_id: this.env,
      owner_id: this.owner,
      triggered_at: new Date()
    };
    try {
      EventModel.create(logEvent);
    } catch (error) {
      logger.error({ error, logEvent }, 'Não foi possível registrar o log');
    }
  }

  async delete(id: string | number) {
    const register = await this.get(id);
    await register.destroy();
  }

  async update(data: MakeNullishOptional<InferCreationAttributes<EventModel>>) {
    const register = await this.get(data.id as number);

    try {
      await register.update(data);
      await register.reload();
      return register;
    } catch (error) {
      const msg = 'Erro ao atualizar o chat';
      logger.error({ data, error }, msg);
      throw new Error(msg);
    }
  }

  public async get(id: string | number) {
    const register = await EventModel.findByPk(id);
    if (!register)
      throw new AppProcessError(
        'O log de evento não foi localizado',
        HTTPResponseCode.informationNotFound
      );
    return register;
  }

  public async getWith(params: WhereOptions<InferAttributes<EventModel, { omit: never }>>) {
    const register = await EventModel.findOne({
      where: params
    });
    return register;
  }

  public async list() {
    try {
      const list = await EventModel.findAll();
      return list;
    } catch (error) {
      const msg = 'Erro ao buscar a lista de eventos';
      logger.error({ error }, msg);
      throw new Error(msg);
    }
  }
}
