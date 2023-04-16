import { Request, Response, NextFunction } from 'express';

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
};

/**
 * Tipos de Status-Code para responses do Express
 * @date 06/04/2023 - 21:36:13
 *
 *
 * */
export const HTTPResponseCode = {
    /* Success */
    continue: 100,
    accepted: 202,
    successfullyProcessedInformation: 200,
    informationNotFound: 203,
    partiallyCompletedProcess: 206,
    registeredInformation: 201,
    redirectingForResponse: 303,

    /* Warning */
    incompleteRequest: 400,
    routeNotFound: 404,
    informationAlreadyExists: 409,
    preconditionRequired: 428,

    /* Error */
    iternalErro: 500,
    methodNotAllowed: 405,
    informationNotTrue: 406,
    preProcessNotInitialized: 424,
    requestTimeOut: 408,
    informationUnauthorized: 401,
    informationBlocked: 403
};
