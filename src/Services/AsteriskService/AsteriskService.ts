import { IUser } from '@core/types/User';
import AsteriskManager from './AsteriskManager';
import { IAsmConnectionProps } from './@types/connection';
import { EnvironmentModel } from '../sequelize/Models';
import { AppProcessError } from '@core/utils';
import { HTTPResponseCode } from '@core/config';
import { ResourceService } from '../app/ResourceService';
import { ResourceTypes } from '@core/config/Resources';
import { logger } from '../Logger';

export class AsteriskService {
  asm: AsteriskManager;

  constructor(options: IAsmConnectionProps) {
    this.connect(options);
  }

  static async init(env_id: string | number) {
    const resource = await ResourceService.getWith({
      type: ResourceTypes.Asterisk,
      env_id
    });
    if (!resource)
      throw new AppProcessError(
        'Este recurso não foi encontrado ou está indisponível para este ambiente',
        HTTPResponseCode.informationNotFound
      );
    try {
      // const connectionProps: IAsmConnectionProps = JSON.parse(resource.params);
      return new this(resource.params as any);
    } catch (error) {
      logger.error(error, 'Houve um erro ao recuperar os parametros deste recurso');
      throw new AppProcessError(
        'Houve um erro ao recuperar os parametros deste recurso',
        HTTPResponseCode.informationNotFound
      );
    }
  }

  connect = (options: IAsmConnectionProps) => {
    this.asm = new AsteriskManager(options, true);
  };
  disconnect = () => {
    this.asm.disconnect();
  };

  showExtensions = async (type: 'tronco' | 'atendente') => {
    const extensions = await this.asm.SIPpeers(type);

    for (const e of extensions) {
      e.state = await this.asm.ExtensionState(e.objectname, 'BLF');
    }
    this.disconnect();

    return extensions;
  };
}
