
import { WASocket } from "@adiwajshing/baileys"
import { uuid } from "uuidv4";
import { logger } from "../components/logger";
import { SendLocalResponse } from "../controllers/responses";


/**
 * @interface ConectionManagerSAAS
 * 
*/
declare interface ConectionManagerSAAS {
    user: {
        name: string,
        id: number,
        token?: string
    }
}

/**
 * @interface ConectionManagerData
 * 
*/
declare interface ConectionManagerData {
    created_timestamp: Date,
    origin?: string
    retries?: number,
}
/**
 * @interface ConectionManagerConn
 * 
*/
declare interface ConectionManagerConn {
    saas: ConectionManagerSAAS,
    name: string,
    type: number,
    id: string,
    status: number,
    data: ConectionManagerData
};
declare interface ConectionManagergetConnStatus {
    (code: string): number;
}
declare interface ConectionManagergetConnType {
    (code: string): number;
}

const ConectionManagerConnStatus: ConectionManagergetConnStatus = (code) => {
    let status: number;
    switch (code) {
        case 'Disconected':
            status = 0;
            break;
        case 'Connected':
            status = 1;
            break;
        case 'Conecting':
            status = 2;
            break;
        case 'Error':
            status = 30;
            break;
        default:
            status = 0;
            break;
    }
    return status;
}
const ConectionManagerConnType: ConectionManagergetConnType = (code) => {
    let status: number;
    switch (code) {
        case 'Whatsapp':
            status = 1;
            break;
        case 'Telegram':
            status = 2;
            break;
        case 'Facebook':
            status = 3;
            break;
        default:
            status = 1;
            break;
    }
    return status;
}


/**
 * Controller responsável pela integração da api @baileys
 * @date 23/03/2023 - 23:18:19
 *
 * @class WhatsappController
 */

class WhatsappManager {
    private sock: WASocket
    public conns: Array<ConectionManagerConn> = [];
    private MessageUpsertCallback: (msg: Object) => {}

    constructor() {
        this.initialize();
    }

    private initialize() {
        console.log('@Baileys started')
        logger.info({ bayles: 'Inicializado' }, 'WhatsappManager pronto')
    }
    public async CreateConn(conn_name: string) {
        const conn = this.ExistsConn(conn_name);

        if (conn) {
            return SendLocalResponse(false, 'A conexão já existe')
        }

        const addConn: ConectionManagerConn = {
            saas: {
                user: {
                    name: 'teste',
                    id: 1
                }
            },
            data: {
                created_timestamp: new Date()
            },
            name: conn_name,
            type: ConectionManagerConnType('Whatsapp'),
            id: uuid(),
            status: ConectionManagerConnStatus('Disconected')
        }

        this.conns.push(addConn);

        return SendLocalResponse(true, 'A conexão adicionada com sucesso')
    }


    public ReturnConns() {
        return this.conns;
    }
    private ExistsConn(conn_name: string) {
        const conn = this.conns.find(conn => {
            return conn.name === conn_name;
        });
        if (!conn) return false;
        return conn
    }
}

export default WhatsappManager
