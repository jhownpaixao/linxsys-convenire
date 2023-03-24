import WhatsappManager from "../classes/whatsapp";
import { NextFunction, Request, Response } from "express";
import { SendHTTPResponse } from "./responses";


/* Constantes */
const Whatsapp = new WhatsappManager;


/* Funções */
export const getWhatsappConections = async () => {
    return Whatsapp.ReturnConns();
}
export const CreateWhatsappConection = async (conn_name: string) => {
    return await Whatsapp.CreateConn(conn_name);
}