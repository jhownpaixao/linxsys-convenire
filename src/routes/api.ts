import express, { NextFunction, Request, Response } from "express";
import * as MainController from '../controllers/main'
import { SendHTTPResponse } from "../controllers/responses";
const APIRouter = express.Router();


APIRouter.get('/listconn', async (req: Request, res: Response, next: NextFunction) => {
    const conns = await MainController.getWhatsappConections();
    SendHTTPResponse({ success: 'Carregado com sucesso', type: 'success', data: conns }, res, next);
})
APIRouter.get('/addconn/:conn', async (req: Request, res: Response, next: NextFunction) => {
    const { conn } = req.params;
    const create = await MainController.CreateWhatsappConection(conn);
    console.log('created', create);
    if (!create.operation) {
       return SendHTTPResponse({ error: create.info, type: 'error' }, res, next);
    }
    return SendHTTPResponse({ success: 'Adicionado com sucesso', type: 'success'}, res, next);
})






export default APIRouter