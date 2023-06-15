import { Request, Response } from 'express';
import { AsteriskService } from '../services/AsteriskService/AsteriskService';
import { CheckRequest, SendHTTPResponse } from '@core/utils';

export class ASMController {
  static extensionList = async (req: Request, res: Response) => {
    const env_id = req.env;
    const { type } = req.query;
    await CheckRequest({ type });

    const service = await AsteriskService.init(env_id);
    const extensions = await service.showExtensions(type as any);

    SendHTTPResponse(
      {
        message: 'Carregado',
        type: 'success',
        data: extensions,
        status: true
      },
      res
    );
  };
}
