import { ServerConfig } from './Server';

/**
 * Nomeclatura dos níveis de  permissões de acesso
 * @date 07/05/2023 - 00:26:12
 *
 * @export
 * @enum {number}
 */
export enum AccessPermissions {
  none, //nenhum acesso
  readonly, //apenas ler
  modify, // ler e atualizar
  createonly, // ler e criar
  create, //ler, criar e atualizar
  all // ler, criar, atualizar e exlcuír
}

export const MethodsArr = [
  [],
  ['GET'],
  ['GET', 'PUT', 'PATH'],
  ['GET', 'POST'],
  ['GET', 'PUT', 'PATH', 'POST'],
  ['GET', 'PUT', 'PATH', 'POST', 'DELETE']
];

enum AccessProfile_Attendant {
  SuperAdmin = AccessPermissions.all,
  Default = AccessPermissions.none,
  Administrator = AccessPermissions.all,
  Operator = AccessPermissions.modify,
  Attendant = AccessPermissions.modify
}

enum AccessProfile_Administrator {
  SuperAdmin = AccessPermissions.all,
  Default = AccessPermissions.none,
  Administrator = AccessPermissions.all,
  Operator = AccessPermissions.modify,
  Attendant = AccessPermissions.none
}

enum AccessProfile_SuperAdmin {
  SuperAdmin = AccessPermissions.all,
  Default = AccessPermissions.none,
  Administrator = AccessPermissions.none,
  Operator = AccessPermissions.none,
  Attendant = AccessPermissions.none
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RouteAccessProfiles: Record<string, any> = {
  [ServerConfig.ROUTES.attendant]: AccessProfile_Attendant,
  [ServerConfig.ROUTES.chatbot]: AccessProfile_Administrator,
  [ServerConfig.ROUTES.connection]: AccessProfile_Administrator,
  [ServerConfig.ROUTES.profile]: AccessProfile_Administrator,
  [ServerConfig.ROUTES.client]: AccessProfile_Attendant,
  [ServerConfig.ROUTES.contact]: AccessProfile_Attendant,
  [ServerConfig.ROUTES.workflow]: AccessProfile_Administrator,
  [ServerConfig.ROUTES.assessment]: AccessProfile_Attendant,
  [ServerConfig.ROUTES.chat]: AccessProfile_Attendant,
  [ServerConfig.ROUTES.user]: AccessProfile_SuperAdmin,
  [ServerConfig.ROUTES.core]: AccessProfile_SuperAdmin,
  [ServerConfig.ROUTES.asm]: AccessProfile_Administrator,
  [ServerConfig.ROUTES.environment]: AccessProfile_Attendant,
  [ServerConfig.ROUTES.auth]: {
    SuperAdmin: AccessPermissions.all,
    Default: AccessPermissions.readonly,
    Administrator: AccessPermissions.readonly,
    Operator: AccessPermissions.readonly,
    Attendant: AccessPermissions.readonly
  }
};
