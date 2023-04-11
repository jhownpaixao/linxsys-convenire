import express, { NextFunction, Request, Response } from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import PinoHttp from "pino-http";
import { UserRoutes, ConnectionRoutes, AuthRoutes } from "./Routes";
import {
        CORSPolicyOptions,
        ExpressResponseOptions,
        SendHTTPResponse,
        logger,
        SetAllowedMethods,
        HTTPResponseCode,
} from "./Core";



console.log('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓███████████████████▓░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▓██▒░░░░░░░░░░░░░░▒▒░░░░░░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▒▒▒░░░░▒▒░▒▒▓▓▓▒░░░░▓██▓░░░░░░▒▒▒░░░▒▒▒░░░░░░░░░▒▒░░░░░░░░░░░░░░░░░░░░░▒▒▒▒░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓██▓▓▓███▓░░░▒███░░░░▓██░░░░░▒▒▒░░░░░░░░░░░░░░▒▒░░░░░░░▒▒▒░░░▒▒▒▒░▒▒▒▒░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓██▒░░░░░▓██▒░░░░▓██▒▒██▓░░░░░░░░▒▒▒▒▒▒▒▒░░░░░░░░▒▒░░░░░░▒▒░░░▒▒░░░░░░░▒░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓██░░░░░░▒██▒░░░░░▒████▒░░░░░░░░░░░░░░░▒▒▒▒▒░░░░░░▒▒░░░░▒▒░░░░░▒▒▒▒▒▒░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░░░░▓███▒░░░░░░░░░░░░░░░░░░▒▒▒░░░░░▒▒░░░▒▒▒░░░░░░░▒▒▒▒▒▒▒░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░░▒██▒▒██▓░░░░░▒▒░░░░░░░░░░░▒▒░░░░░░▒▒░▒▒▒░░░░░░░░░░░░░▒▒▒░░░')
console.log('░░░███▒▒▒▒▒▒▒▒▒░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░▓██▒░░░▓█▓░░░░░▒▒▒▒░░░░░░▒▒▒░░░░░░░▒▒▒▒▒░░░░░░▒▒▒░░░░░▒▒▒░░░')
console.log('░░░████████████▒░░▓█▓░░░▒█▓░░░░░░▒██▒░▒██▓░░░░░░▓█▓░░░░░░▒▒▒▒▒▒▒▒▒░░░░░░░░░░▒▒▒░░░░░░░░░▒▒▒▒▒▒▒░░░░░')
console.log('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░▒░░░░░▒░▒░░░▒░░░░▒░░░░░░░░░░░░▒▒▒░░░▒░░░░░▒░░░░░░░░░░░▒░░▒░░░░░▒░░░░░░░▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░▒▒░░░▒░░▒░░░▒░░░░▒░▒░░░▒░░░░░░▒░▒░░░▓▒░░░░▒▒▒░░░░▒▒▒░░▒▒▒▒░░░░░▓░░▒░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░')
console.log(' ')

const app = express();
const pinoHttp = PinoHttp({ logger: logger });
const APP_PORT = process.env.BACKEND_PORT || 4000;
const APP_URL = process.env.BACKEND_URL || 'http://localhost';


(async () => {


        /* Configurações */
        app.use(express.json())
        app.use(express.urlencoded({ extended: false }))
        /* app.use(bodyParser.json()) */
        app.use(pinoHttp)
        app.all('*', ExpressResponseOptions);
        await SetAllowedMethods(app);
        app.use(cors(CORSPolicyOptions));


        /* Rotas */
        app.use('/connection', ConnectionRoutes);
        app.use('/user', UserRoutes);
        app.use('/auth', AuthRoutes);



        app.use((req: Request, res: Response, next: NextFunction) => {
                SendHTTPResponse({ message: 'Rota não encontrado', type: 'error', status: false, code: HTTPResponseCode.routeNotFound }, res)
        })
        /* Iniciar Servidor */
        app.listen(APP_PORT, () => {
                console.log(`⚡ Servidor Iniciado| 🌍 ${APP_URL}:${APP_PORT}`)
                logger.info({ APP_URL, APP_PORT }, '⚡ Servidor Iniciado')
        })

})()