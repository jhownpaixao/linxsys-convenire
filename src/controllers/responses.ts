import express, { Request, Response, NextFunction } from "express";
import { logger } from "../components/logger";



export function SendHTTPResponse(data: { error?: string, success?: string, type: string, data?: any }, res: Response, next: NextFunction) {
    if (!data) {
        logger.info({ info: 'O objeto de resposta está vazío' })
    }

    switch (data.type) {
        case 'warning':
            logger.info({ info: data.error })
            break;

        case 'error':
            logger.error({ error: data.error })
            break;
    }
    res.write(JSON.stringify(data));
    res.end();
    return next();
};

export function SendLocalResponse(operation: boolean, info: string = '', data: any = {}) {

    return {
        operation,
        info,
        data
    }
}