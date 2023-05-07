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
enum AttendantAccessProfile {
    Administrator = AccessPermissions.all,
    Default = AccessPermissions.none,
    Company = AccessPermissions.all,
    Operator = AccessPermissions.modify,
    Attendant = AccessPermissions.modify
}

enum CompanyAccessProfile {
    Administrator = AccessPermissions.all,
    Default = AccessPermissions.none,
    Company = AccessPermissions.all,
    Operator = AccessPermissions.modify,
    Attendant = AccessPermissions.none
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RouteAccessProfiles: Record<string, any> = {
    [ServerConfig.ROUTES.attendant]: AttendantAccessProfile,
    [ServerConfig.ROUTES.chatbot]: CompanyAccessProfile,
    [ServerConfig.ROUTES.connection]: CompanyAccessProfile,
    [ServerConfig.ROUTES.profile]: CompanyAccessProfile,
    [ServerConfig.ROUTES.client]: AttendantAccessProfile,
    [ServerConfig.ROUTES.contact]: AttendantAccessProfile,
    [ServerConfig.ROUTES.workflow]: CompanyAccessProfile,
    [ServerConfig.ROUTES.user]: {
        Administrator: AccessPermissions.all,
        Default: AccessPermissions.none,
        Company: AccessPermissions.none,
        Operator: AccessPermissions.none,
        Attendant: AccessPermissions.none
    },
    [ServerConfig.ROUTES.auth]: {
        Administrator: AccessPermissions.all,
        Default: AccessPermissions.readonly,
        Company: AccessPermissions.readonly,
        Operator: AccessPermissions.readonly,
        Attendant: AccessPermissions.readonly
    }
};
