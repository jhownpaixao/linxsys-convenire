import * as crypto from 'crypto';
import { MethodsArr, RouteAccessProfiles } from '@core/config/Access';
import type { UserAuthMiddlewareProps } from '../../middlewares';
import { AppProcessError } from '@core/utils';
import { HTTPResponseCode, SecurityConfig } from '@core/config';
import type { Request } from 'express';
import { logger } from '../../services/logger';

/**
 * Servico de segurança e controle de acesso à recursos e níveis
 * @service
 */
export class SecurityService {
  // !Static Methods
  static encrypt(data: string | object): [string, Buffer] {
    if (process.versions.openssl <= '1.0.1f') {
      throw new Error('OpenSSL Version too old, vulnerability to Heartbleed');
    }
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(SecurityConfig.initialVector);
    const cipher = crypto.createCipheriv(SecurityConfig.AESMethod, Buffer.from(key), iv);
    let encrypted = cipher.update(data as crypto.BinaryLike);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return [iv.toString('hex') + ':' + encrypted.toString('hex'), key];
  }

  static decrypt(data: string, key: Buffer) {
    try {
      const textParts = data.split(':');
      const iv = Buffer.from(textParts.shift() as string, 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv(SecurityConfig.AESMethod, Buffer.from(key), iv);
      let decrypted = decipher.update(encryptedText);

      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString();
    } catch (error) {
      return false;
    }
  }

  static uniqkey = crypto.randomUUID;

  static uniqtoken(length = 20) {
    return this.randomString(
      length,
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    );
  }

  static requestAccessPermission(user: UserAuthMiddlewareProps, req: Request) {
    try {
      const access_policy = RouteAccessProfiles[req.baseUrl];
      const arrays_permissions = MethodsArr[access_policy[user.type]];
      const method = req.method;

      if (!arrays_permissions.includes(method))
        throw new AppProcessError(
          'Usuário sem permissão de acesso à este recurso',
          HTTPResponseCode.informationBlocked
        );
    } catch (error) {
      logger.error(error, 'Erro ao buscar as permissões de acesso');
      throw Error('Erro ao buscar as permissões de acesso');
    }
  }

  // ?Getters
  static getAccessRoute() {}
  static getAccessLevel() {}
  static getAccessResource() {}
  static getAccessPermissions() {}

  // !Private Subroutines
  private static randomString(length: number, chars: string) {
    const charsLength = chars.length;
    const randomBytes = crypto.randomBytes(length);
    const result = new Array(length);

    let cursor = 0;
    for (let i = 0; i < length; i++) {
      cursor += randomBytes[i];
      result[i] = chars[cursor % charsLength];
    }

    return result.join('');
  }
}
