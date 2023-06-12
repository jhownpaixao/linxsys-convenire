import type { IEnvironment } from './Environment';

/**
 * Tipos de Usuários e levels
 * @date 05/05/2023 - 18:36:43
 * * Estes ENUM contem o nível de acesso à rotas determinados pelo type do usuário
 * @export
 * @enum {number}
 */
export enum UserType {
  SuperAdmin = 1,
  Default = 2,
  Operator = 3,
  Administrator = 4,
  Attendant = 5
}

export interface IUser {
  id: number;
  name: string;
  pass?: string;
  env_id: string;
  email: string;
  uniqkey: string;
  picture?: string;
  type: string | TUserTypes;
  block_with_venc?: string;
  group_id?: number | null;
  date_venc?: string;
  loged_at?: string;
  params?: object | null;
  createdAt?: string;
  updatedAt?: string;
  environment?: IEnvironment;
}

export type TUserTypes = 'Administrator' | 'Default' | 'SuperAdmin' | 'Operator';
