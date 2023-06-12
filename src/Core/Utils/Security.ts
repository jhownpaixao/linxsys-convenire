import * as crypto from 'crypto';
import { MethodsArr, RouteAccessProfiles } from '../config';
import type { UserAuthMiddlewareProps } from '../../middlewares';
import { AppProcessError } from './Responses';
import { HTTPResponseCode, SecurityConfig } from '../config';
import type { Request } from 'express';
import { logger } from '../../services/Logger';

export class Security {
  // !Static Methodos
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
      logger.error(error, 'Erro durante a descriptografia de dados');
      throw new Error('Erro durante a descriptografia de dados');
    }
  }

  static requestAccessPermission(user: UserAuthMiddlewareProps, req: Request) {
    const access_policy = RouteAccessProfiles[req.baseUrl];
    const arrays_permissions = MethodsArr[access_policy[user.type]];
    const method = req.method;

    if (!arrays_permissions.includes(method))
      throw new AppProcessError(
        'Usuário sem permissão de acesso à este recurso',
        HTTPResponseCode.informationBlocked
      );
  }

  static uniqkey = crypto.randomUUID;

  static uniqtoken(length = 20) {
    const randLetter = () =>
      this.randomString(
        length,
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@!#'
      );
    const d = new Date();

    let token = d.getDate().toString();
    token += randLetter();
    token += d.getMonth().toString();
    token += d.getSeconds().toString();
    return token;
  }

  // !Private Static Methodos
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
