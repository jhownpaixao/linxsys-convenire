import { Response, Request } from 'express';
import { CheckRequest, SendHTTPResponse, HTTPResponseCode, ServerConfig } from '../Core';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import jwktopem from 'jwk-to-pem';
import { AuthConfig } from '../Core/Config/Auth';
import { AuthService } from '../Services/AppService';

export class AuthController {
    public static validadeLogin = async (req: Request, res: Response) => {
        /* EncodedKeyMap | EncondedDataCompare */
        const { ekm, edc } = req.params;

        await CheckRequest({ ekm, edc });
        const { user, token } = await AuthService.validateLogin({ edc, ekm });

        /* For an optional cached token implementation */
        /* const options: CookieOptions = {
            maxAge: 1000 * 60 * 60 * 24, // 24hour
            httpOnly: true, // The cookie only accessible by the web server
            signed: true, // Indicates if the cookie should be signed
            secure: true,
            sameSite: 'strict'
        };
        res.cookie('SIGNED_EDC', 'PASSED_ONLY', options); */

        return SendHTTPResponse({ message: 'logado com sucesso', status: true, data: { token, user }, type: 'success' }, res);
    };

    public static login = async (req: Request, res: Response) => {
        const { email, pass } = req.body;

        await CheckRequest({ email, pass });

        const [key, encrypted] = await AuthService.login({ email, pass });
        return SendHTTPResponse(
            {
                message: 'Confirmar autorização',
                status: true,
                type: 'success',
                data: { ekm: key, edc: encrypted, confirmation: `${ServerConfig.ROUTES.auth}/validate/${key}/${encrypted}` },
                location: `${ServerConfig.ROUTES.auth}/validate/${key}/${encrypted}`,
                code: HTTPResponseCode.accepted
            },
            res
        );

        //res.redirect(HTTPResponseCode.redirectingForResponse, `/auth/validate/${key}/${encrypted}`);
    };

    public static sign = async (req: Request, res: Response) => {
        const token = await AuthService.signData(req.body);
        return SendHTTPResponse({ message: 'Signed', status: true, type: 'success', data: { token } }, res);
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
}
