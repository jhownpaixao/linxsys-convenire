import { Request, Response, NextFunction } from 'express';
import { logger } from '../../Services/Logger';
import { HTTPResponse, ResponseType } from '../Types';
import { HTTPResponseCode, CORSPolicyOptions, AllowedMethods } from '../Config';
import * as core from 'express-serve-static-core';

/**
 * Description placeholder
 * @date 07/04/2023 - 15:22:19
 *
 */
const ResponseFormulation = process.env.RESPONSE_FORMULATION_TYPE || 'standart';
/**
 * Envia uma Response HTTP padronizada
 * @date 25/03/2023 - 11:48:29
 *
 * @export SendHTTPResponse
 * @param {{ error?: string, success?: string, type: string, data?: any }} data
 * @param {Response} res
 * @param {?NextFunction} [next] Utilize o next para continuar a requisição, caso contrário a requisição será encerrada
 */
export function SendHTTPResponse(objResponse: HTTPResponse, res: Response, next?: NextFunction): void {
    if (!objResponse) {
        logger.error({ info: 'O objeto de resposta está vazío' });
    }

    switch (objResponse.type) {
        case 'success':
            logger.info({ objResponse }, objResponse.message);
            break;
        case 'warning':
            logger.warn({ objResponse }, objResponse.message);
            break;
        case 'error':
            logger.error({ objResponse }, objResponse.message);
            break;
        default:
            logger.debug({ objResponse }, objResponse.message);
            break;
    }
    objResponse.timestamp = Date.now();
    if (!objResponse.code) objResponse.code = HTTPResponseCode.successfullyProcessedInformation;
    res.status(objResponse.code);

    if (objResponse.location) {
        res.location(objResponse.location);
        delete objResponse.location;
    }

    let FormulatedResponse;
    switch (ResponseFormulation) {
        case 'direct':
            if (objResponse['data']) FormulatedResponse = objResponse.data;
            break;
        case 'standart':
            FormulatedResponse = objResponse;
            break;
        default:
            FormulatedResponse = objResponse;
            break;
    }

    if (next) {
        res.write(JSON.stringify(FormulatedResponse));
        next();
    } else {
        res.send(JSON.stringify(FormulatedResponse));
    }
}

/**
 * Envia uma Response LOCAL padronizada
 * @date 25/03/2023 - 11:48:29
 *
 * @export
 * @returns {{ operation: boolean; info: string; data: any; }}
 */
export function SendLocalResponse(operation: boolean, info = '', data = {}) {
    return {
        operation,
        info,
        data
    };
}

/**
 * Verifica os parametros informados e retorna os negativos (null,String(''),lenght=0,'Não informado')
 * @date 07/04/2023 - 15:22:19
 *
 * @export
 * @async
 * @param {Object} params
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export async function CheckRequest(params: Object) {
    let pass = true;
    const need = [];
    for (const [key, param] of Object.entries(params)) {
        if (
            !param ||
            param === null ||
            param.length < 1 ||
            (typeof param === 'string' && param === '') ||
            (typeof param === 'object' && Object.values(param).length < 1)
        ) {
            pass = false;
            need.push(key);
        }
    }

    if (!pass) throw new AppProcessError('Requisição incompleta', HTTPResponseCode.incompleteRequest, 'error', { need });
}

/**
 * Expõe o erro gerado em uma requisição para o log e informa no response
 * @date 07/04/2023 - 15:22:19
 *
 * @export
 * @param {number} code
 * @param {*} exception
 * @param {Response} res
 */
export function ThrowHTTPErrorResponse(code: number, exception: Error, res: Response) {
    logger.error({ error: exception.message, stack: exception.stack }, 'Uma requisição retornou um erro');
    SendHTTPResponse({ message: 'Houve um erro ao acessar este recurso', type: 'error', status: false, code: 500 }, res);
}

/**
 * Expõe um metodo não permitido
 * @date 07/04/2023 - 15:22:19
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {?NextFunction} [next]
 */
export function ThrowHTTPMethodNotAllowed(req: Request, res: Response) {
    logger.error({ req }, 'Houve uma acesso à rota com o método não permitido');
    SendHTTPResponse({ message: 'Método não permitido', status: false, type: 'error', code: HTTPResponseCode.methodNotAllowed }, res);
}

/**
 * Envia as opções definidas e suportadas pela rota
 * @date 07/04/2023 - 15:22:19
 *
 * @export
 * @param {Response} res
 * @param {string} options
 */
export function SendHTTPMethodOPTIONS(res: Response, options: string) {
    res.header('Access-Control-Allow-Origin', /* Array(CORSPolicyOptions.origin).join(',') */ '*');
    res.header('Access-Control-Allow-Methods', options);
    res.header('Access-Control-Allow-Headers', Array(CORSPolicyOptions.allowedHeaders).join(','));
    res.sendStatus(204);
}

/**
 * Denifi os métodos permitidos por rota (forma individual)
 * @date 07/04/2023 - 15:21:24
 * @async
 */
export const SetAllowedMethods = async (app: core.Express) => {
    for (const [route, method] of Object.entries(AllowedMethods)) {
        app.options(route, (req, res) => SendHTTPMethodOPTIONS(res, method));
    }
};

export const handleAuthorizationFailure = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        throw new AppProcessError('Falha na autorização', HTTPResponseCode.informationUnauthorized);
    } else {
        next(err);
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleProcessFailure = async (err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof AppProcessError) {
        return SendHTTPResponse({ message: err.message, type: err.level, status: false, code: err.statusCode, data: err.data }, res);
    }
    ThrowHTTPErrorResponse(500, err, res);
};

export const handleRouteNotFound = (req: Request, res: Response) => {
    SendHTTPResponse({ message: 'Rota não encontrado', type: 'error', status: false, code: HTTPResponseCode.routeNotFound }, res);
};

export class AppProcessError {
    public readonly message: string;
    public readonly statusCode: number;
    public readonly level: ResponseType;
    public data: unknown;

    constructor(message: string, statusCode = 400, level: ResponseType = 'error', data?: unknown) {
        this.message = message;
        this.statusCode = statusCode;
        this.level = level;
        this.data = data;
    }
}
