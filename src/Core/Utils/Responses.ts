import express, { Request, Response, NextFunction } from "express";
import { logger } from "../Logger/Logger";
import { HTTPResponse } from '../Types'
import { HTTPResponseCode, CORSPolicyOptions, AllowedMethods } from "../Config";
import * as core from 'express-serve-static-core';
/**
 * Description placeholder
 * @date 07/04/2023 - 15:22:19
 *
 * @type {*}
 */
const ResponseFormulation = process.env.RESPONSE_FORMULATION_TYPE || 'standart'
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
        logger.error({ info: 'O objeto de resposta está vazío' })
    }

    switch (objResponse.type) {
        case 'success':
            logger.info({ objResponse }, objResponse.message)
            break;
        case 'warning':
            logger.warn({ objResponse }, objResponse.message)
            break;
        case 'error':
            logger.error({ objResponse }, objResponse.message)
            break;
        default:
            logger.debug({ objResponse }, objResponse.message)
            break;
    }
    objResponse.timestamp = Date.now()
    if (!objResponse.code) objResponse.code = HTTPResponseCode.successfullyProcessedInformation
    res.status(objResponse.code);

    let FormulatedResponse;

    switch (ResponseFormulation) {
        case 'direct':
            if (objResponse['data']) FormulatedResponse = objResponse.data
            break;
        case 'standart':
            FormulatedResponse = objResponse
        default:
            FormulatedResponse = objResponse
            break;
    }


    if (next) {
        res.write(JSON.stringify(FormulatedResponse));
        next();
    } else {
        res.send(JSON.stringify(FormulatedResponse));
    }
};

/**
 * Envia uma Response LOCAL padronizada
 * @date 25/03/2023 - 11:48:29
 *
 * @export
 * @param {boolean} operation
 * @param {string} [info='']
 * @param {*} [data={}]
 * @returns {{ operation: boolean; info: string; data: any; }}
 */
export function SendLocalResponse(operation: boolean, info: string = '', data: any = {}) {

    return {
        operation,
        info,
        data
    }
}

/**
 * Verifica os parametros informados e retorna os negativos (null,String(''),lenght=0,'Não informado')
 * @date 07/04/2023 - 15:22:19
 *
 * @export
 * @async
 * @param {Object} params
 * @returns {Promise<[boolean, string?]>}
 */
export async function CheckRequest(params: Object): Promise<[boolean, string?]> {
    let pass: boolean = true;
    let paramError: string = '';
    for (const [key, param] of Object.entries(params)) {
        if (
            !param ||
            param === null ||
            param.length < 1 ||
            (typeof param === 'string' && param === '') ||
            (typeof param === 'object' && Object.values(param).length < 1)
        ) {
            pass = false;
            paramError = key;
        }
    }

    return [pass, paramError];
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
export function ThrowHTTPErrorResponse(code: number, exception: any, res: Response) {
    logger.error({ exception }, 'Uma requisição retornou um erro')
    SendHTTPResponse({ message: 'Houve um erro ao acessar este recurso', type: 'error', status: false, code: 500 }, res)
};

/**
 * Expõe um metodo não permitido
 * @date 07/04/2023 - 15:22:19
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {?NextFunction} [next]
 */
export function ThrowHTTPMethodNotAllowed(req: Request, res: Response, next?: NextFunction) {
    logger.error({ req }, 'Houve uma acesso à rota com o método não permitido')
    SendHTTPResponse({ message: "Método não permitido", status: false, type: "error", code: HTTPResponseCode.methodNotAllowed }, res)
};
/**
 * Envia as opções definidas e suportadas pela rota
 * @date 07/04/2023 - 15:22:19
 *
 * @export
 * @param {Response} res
 * @param {string} options
 */
export function SendHTTPMethodOPTIONS(res: Response, options: string) {
    res.header('Access-Control-Allow-Origin', Array(CORSPolicyOptions.origin).join(','));
    res.header('Access-Control-Allow-Methods', options);
    res.header('Access-Control-Allow-Headers', Array(CORSPolicyOptions.allowedHeaders).join(','));
    res.send(204);
};
/**
 * Denifi os métodos permitidos por rota (forma individual)
 * @date 07/04/2023 - 15:21:24
 * @async
 */
export const SetAllowedMethods = async (app: core.Express) => {
    for (const [route, method] of Object.entries(AllowedMethods)) {
        app.options(route, (req, res, next) => SendHTTPMethodOPTIONS(res, method))
    }
}

export const VerifyFailAuthorization = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === "UnauthorizedError") {
        SendHTTPResponse({ message: 'Autorização inválida', status: false, type: 'error', code: HTTPResponseCode.informationUnauthorized }, res);
    } else {
        next(err)
    }
}

export const VerifyFailProccess = (err: Error, req: Request, res: Response, next: NextFunction) => {
    ThrowHTTPErrorResponse(500, err, res)
}

export const RouteNotFound = (err: Error, req: Request, res: Response, next: NextFunction) => {
    SendHTTPResponse({ message: 'Rota não encontrado', type: 'error', status: false, code: HTTPResponseCode.routeNotFound }, res)
}
