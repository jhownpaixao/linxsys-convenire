import { Request } from 'express';
/**
 * Tipos padrões para o tipo de response
 * @date 26/03/2023 - 21:45:23
 *
 */
export declare type ResponseType = 'error' | 'success' | 'warning';

/**
 * Objeto de response padronizado
 * @date 26/03/2023 - 21:45:23
 *
 */
export declare type HTTPResponse = {
    status: boolean;
    message: string;
    type: ResponseType;
    code?: number;
    location?: string;
    timestamp?: number;
    data?: unknown;
};

export declare interface HTTPResponseError {
    message: string;
    code: number;
    data?: object;
}
