import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, ServerConfig, HTTPResponseCode } from '@core';
import { EnvironmentService, CustomerService } from '../services/app';
import { EventLog, EventLogMethod, EventLogTarget } from '../services/app/Event';

export class CustomerController {
  static store = async (req: Request, res: Response) => {
    const { nome, contato } = req.body;

    await CheckRequest({ contato, nome });

    const client = await CustomerService.create({
      ...req.body,
      env_id: req.env
    });

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.customer,
      EventLogMethod.created,
      client.id
    );
    SendHTTPResponse(
      {
        message: 'Cliente criado com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.client}/${client.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static get = async (req: Request, res: Response) => {
    const { client_id } = req.params;

    const user = await CustomerService.get(client_id);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: user },
      res
    );
  };

  static list = async (req: Request, res: Response) => {
    const list = await EnvironmentService.listCustomers(req.env);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: list },
      res
    );
  };

  static contacts = async (req: Request, res: Response) => {
    const { client_id } = req.params;

    const contacts = await CustomerService.listContacts(client_id);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: contacts },
      res
    );
  };

  static addContact = async (req: Request, res: Response) => {
    const { client_id } = req.params;
    const { contato, params, comments } = req.body;

    await CheckRequest({ contato });

    const contact = await CustomerService.addContact(client_id, {
      value: contato,
      params,
      comments
    });

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.contact,
      EventLogMethod.created,
      contact.id
    );

    SendHTTPResponse(
      {
        message: 'Contato criado e vinculado',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.contact}/${contact.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };
}
