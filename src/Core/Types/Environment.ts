import type { IUser } from './User';

export interface IEnvironment {
  id: number;
  name: string;
  email: string;
  isotipo?: string;
  logotipo?: string;
  env_token: string;
  block_with_venc: string;
  date_venc: string;
  createdAt: string;
  updatedAt: string;
  params?: string;
  users?: IUser[];
}
