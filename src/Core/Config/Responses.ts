import { Request, Response, NextFunction } from "express"

/**
 * Função de configuração do Express
 * @date 06/04/2023 - 21:36:13
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const ExpressResponseOptions = (req: Request, res: Response, next: NextFunction) => {

    res.contentType('application/json');
    next();

}

/**
 * Tipos de Status Code para responses do Express
 * @date 06/04/2023 - 21:36:13
 *
 * @type {{ successfullyProcessedInformation: number; informationNotFound: number; partiallyCompletedProcess: number; registeredInformation: number; incompleteRequest: number; routeNotFound: number; informationAlreadyExists: number; iternalErro: number; }}
 */
export const HTTPResponseCode = {
    /* Success */
    successfullyProcessedInformation: 200,
    informationNotFound: 203,
    partiallyCompletedProcess: 206,
    registeredInformation: 201,

    /* Warning */
    incompleteRequest: 400,
    routeNotFound: 404,
    informationAlreadyExists: 409,

    /* Error */
    iternalErro: 500,

}