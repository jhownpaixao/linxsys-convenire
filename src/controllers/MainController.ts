import ConnectionController from "./ConnectionController";
import { SendHTTPResponse } from "../Utils/responses";


/* Constantes */
const ConnManager = new ConnectionController;


/* Funções */
export const ListConections = async () => {
    return ConnManager.ReturnConns();
}
export const CreateConection = async (conn_name: string, type: string, user_id: number) => {
    return await ConnManager.CreateConn(conn_name, type, user_id);
}