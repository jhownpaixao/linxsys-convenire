import type { Response, Request } from 'express';
import { CheckRequest, SendHTTPResponse, HTTPResponseCode, ServerConfig } from '@core';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import jwktopem from 'jwk-to-pem';
import { AuthConfig } from '@core/config/Auth';
import { AuthService } from '../services/app';

export class AuthController {
  public static validadeLogin = async (req: Request, res: Response) => {
    /* EncodedKeyMap | EncondedDataCompare */
    const { ekm, edc } = req.params;

    await CheckRequest({ ekm, edc });
    const { user, token } = await AuthService.validateLogin({ edc, ekm });

    return SendHTTPResponse(
      { message: 'logado com sucesso', status: true, data: { token, user }, type: 'success' },
      res
    );
  };

  public static login = async (req: Request, res: Response) => {
    const { email, pass } = req.body;

    await CheckRequest({ email, pass });

    const [key, encrypted, isLogedIn] = await AuthService.login({ email, pass });
    return SendHTTPResponse(
      {
        message: 'Confirmar autorização',
        status: true,
        type: 'success',
        data: {
          ekm: key,
          isLogedIn,
          edc: encrypted,
          confirmation: `${ServerConfig.ROUTES.auth}/validate/${key}/${encrypted}`
        },
        location: `${ServerConfig.ROUTES.auth}/validate/${key}/${encrypted}`,
        code: HTTPResponseCode.accepted
      },
      res
    );

    //res.redirect(HTTPResponseCode.redirectingForResponse, `/auth/validate/${key}/${encrypted}`);
  };

  public static logout = async (req: Request, res: Response) => {
    AuthService.deleteLogin(req.user.uniqkey);
    SendHTTPResponse(
      {
        status: true,
        message: 'Deslogado',
        type: 'success'
      },
      res
    );
  };
  public static sign = async (req: Request, res: Response) => {
    const token = await AuthService.signData(req.body);
    return SendHTTPResponse(
      { message: 'Signed', status: true, type: 'success', data: { token } },
      res
    );
  };

  public static verify = async (req: Request, res: Response) => {
    const { token } = req.body;
    const { data } = await axios.get(AuthConfig.AuthJWKSURI + '/keys');
    const [firstKey] = data.keys;
    const publicKey = jwktopem(firstKey);
    try {
      const decoded = jwt.verify(token, publicKey);
      res.send(decoded);
    } catch (e) {
      res.send({ error: e });
    }
  };

  public static validate = async (req: Request, res: Response) => {
    const token = req.headers.authorization.split(' ')[1];
    const user = await AuthService.validate(req.user, token);

    SendHTTPResponse(
      {
        message: 'Sessão ativa',
        type: 'success',
        data: user,
        status: true
      },
      res
    );
  };

  public static validatePassowrd = async (req: Request, res: Response) => {
    const { password } = req.body;
    const id = req.user.id;

    await CheckRequest({ password });

    await AuthService.validatePassword(id, password);

    SendHTTPResponse(
      {
        message: 'Confirmado',
        type: 'success',
        status: true
      },
      res
    );
  };
}
