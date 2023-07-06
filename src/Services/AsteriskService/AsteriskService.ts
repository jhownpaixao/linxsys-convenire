import { HTTPResponseCode } from '@core/config';
import { ResourceTypes } from '@core/config/Resources';
import { AppProcessError } from '@core/utils';
import { logger } from '../Logger';
import { ResourceService } from '../app/ResourceService';
import { IAsmConnectionProps, IXApiConnectionProps } from './@types/connection';
import AsteriskManager from './AsteriskManager';
import { XApi } from './XApi';

type TConnectionProps = IAsmConnectionProps & IXApiConnectionProps;
export class AsteriskService {
  asm: AsteriskManager;
  xapi: XApi;
  options: TConnectionProps;

  constructor(options: TConnectionProps) {
    this.options = options;
  }

  static async init(env_id: string | number) {
    const resource = await ResourceService.getWith({
      type: ResourceTypes.PABX,
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

  connect = async () => {
    this.asm = new AsteriskManager(this.options, true);
    const conn = await this.asm.connect();

    if (!conn)
      throw new AppProcessError(
        'Não foi possível se conectar ao asterisk',
        HTTPResponseCode.iternalErro
      );

    this.xapi = new XApi(this.options.host, this.options.token);
  };

  disconnect = () => {
    this.asm.disconnect();
  };

  showExtensions = async (type: 'tronco' | 'atendente') => {
    await this.connect();
    const extensions = await this.asm.SIPPeers(type);

    if (extensions instanceof Error)
      throw new AppProcessError(
        'Não foi possível obter os dados SIPpeers',
        HTTPResponseCode.iternalErro
      );

    const xpaiExtensionsData = await this.xapi.listExtensions();
    for (const e of extensions) {
      const state = await this.asm.ExtensionState(e.objectname, 'BLF');
      if (state instanceof Error)
        throw new AppProcessError(
          'Não foi possível obter os estados dos SIPpeers',
          HTTPResponseCode.iternalErro
        );
      const data = xpaiExtensionsData.find((ext) => ext.ramal === e.objectname);
      if (data) state.name = data.apelido;
      e.state = state;
    }
    this.disconnect();

    return extensions;
  };

  showActiveCalls = async () => {
    await this.connect();
    const channels = await this.asm.ActiveCalls();

    if (channels instanceof Error)
      throw new AppProcessError(
        'Não foi possível obter os dados dos canais',
        HTTPResponseCode.iternalErro
      );

    this.disconnect();

    return channels;
  };
}
