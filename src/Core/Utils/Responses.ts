import express, { Request, Response, NextFunction } from "express";
import { logger } from "../Logger/Logger";
import { HTTPResponse } from '../Types'
import { HTTPResponseCode } from "../Config";
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

export function ThrowHTTPErrorResponse(code: number, exception: any, res: Response) {
    logger.error({ exception }, 'Uma requisição retornou um erro')
    SendHTTPResponse({ message: 'Houve um erro ao acessar este recurso', type: 'error', status: false, code: 500 }, res)
};


