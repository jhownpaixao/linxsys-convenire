import express, { NextFunction, Request, Response } from "express";
import * as MainController from '../../controllers/MainController'
import { SendHTTPResponse } from "../../Utils/responses";
const routes = express.Router();


routes.get('/listconn', async (req: Request, res: Response, next: NextFunction) => {
    const conns = await MainController.ListConections();
    SendHTTPResponse({ success: 'Carregado com sucesso', type: 'success', data: conns }, res, next);
})
routes.post('/addconn', async (req: Request, res: Response, next: NextFunction) => {
    const { conn_name, type, user_id } = req.body;
    const create = await MainController.CreateConection(conn_name, type, user_id);
    if (!create.operation) {
        return SendHTTPResponse({ error: create.info, type: 'error' }, res, next);
    }
    return SendHTTPResponse({ success: 'Adicionado com sucesso', type: 'success' }, res, next);
})



export default routes