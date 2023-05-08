import ConnectionManager from '@core/utils/ConnectionManager';

/* Constantes */
const ConnManager = new ConnectionManager();

/* Funções */
export const ListConections = async () => {
    return ConnManager.ReturnConns();
};

export const CreateConection = async (conn_name: string, type: string, user_id: number) => {
    return await ConnManager.CreateConn(conn_name, type, user_id);
};
