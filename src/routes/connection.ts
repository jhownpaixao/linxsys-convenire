import express, { NextFunction, Request, Response } from "express";
import * as MainController from '../Controllers/MainController'
import { SendHTTPResponse } from "../Core";
const routes = express.Router();


routes.get('/listconn', async (req: Request, res: Response, next: NextFunction) => {
    const conns = await MainController.ListConections();
    SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: conns }, res);
})
routes.post('/addconn', async (req: Request, res: Response, next: NextFunction) => {
    const { conn_name, type, user_id } = req.body;
    const create = await MainController.CreateConection(conn_name, type, user_id);
    if (!create.operation) {
        return SendHTTPResponse({ message: create.info, type: 'error', status: false }, res);
    }
    return SendHTTPResponse({ message: 'Adicionado com sucesso', type: 'success', status: true, data: { connection: create.data } }, res);
})



export default routes