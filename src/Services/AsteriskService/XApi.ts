import { API } from '@core/class/API';
import { XApiExtension } from './@types/peer';

type ff = {
  success: boolean;
};
export class XApi extends API {
  token: string;
  constructor(host: string, token: string) {
    super(`http://${host}`);
    this.token = token;
  }

  async listExtensions(): Promise<XApiExtension[]> {
    const extensions = await this.requestFormData<ff & XApiExtension[]>(
      '/api/list_extensions.php',
      {
        token: this.token
      }
    );
    if (extensions?.success === false || !Array.isArray(extensions)) return [];
    return extensions;
  }
}
