import express from 'express';
import cors from 'cors';
import PinoHttp from 'pino-http';
import { UserRoutes, ConnectionRoutes, AuthRoutes } from './Routes';
import cookieParser = require('cookie-parser');
import path from 'path';
import { fork } from 'child_process';
import {
    CORSPolicyOptions,
    ExpressResponseOptions,
    logger,
    SetAllowedMethods,
    VerifyFailAuthorization,
    VerifyFailProccess,
    RouteNotFound
} from './Core';
import { AuthController } from './Controllers';

console.log('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░');
console.log('░░░██▓░░░░░░░░░░░░▓███████████████████▓░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░');
console.log('░░░██▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▓██▒░░░░░░░░░░░░░░▒▒░░░░░░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░');
console.log('░░░██▓░░░░░░░░░░░░▒▒▒░░░░▒▒░▒▒▓▓▓▒░░░░▓██▓░░░░░░▒▒▒░░░▒▒▒░░░░░░░░░▒▒░░░░░░░░░░░░░░░░░░░░░▒▒▒▒░░░░░░░');
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓██▓▓▓███▓░░░▒███░░░░▓██░░░░░▒▒▒░░░░░░░░░░░░░░▒▒░░░░░░░▒▒▒░░░▒▒▒▒░▒▒▒▒░░░░');
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓██▒░░░░░▓██▒░░░░▓██▒▒██▓░░░░░░░░▒▒▒▒▒▒▒▒░░░░░░░░▒▒░░░░░░▒▒░░░▒▒░░░░░░░▒░░░░');
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓██░░░░░░▒██▒░░░░░▒████▒░░░░░░░░░░░░░░░▒▒▒▒▒░░░░░░▒▒░░░░▒▒░░░░░▒▒▒▒▒▒░░░░░░░');
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░░░░▓███▒░░░░░░░░░░░░░░░░░░▒▒▒░░░░░▒▒░░░▒▒▒░░░░░░░▒▒▒▒▒▒▒░░░░');
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░░▒██▒▒██▓░░░░░▒▒░░░░░░░░░░░▒▒░░░░░░▒▒░▒▒▒░░░░░░░░░░░░░▒▒▒░░░');
console.log('░░░███▒▒▒▒▒▒▒▒▒░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░▓██▒░░░▓█▓░░░░░▒▒▒▒░░░░░░▒▒▒░░░░░░░▒▒▒▒▒░░░░░░▒▒▒░░░░░▒▒▒░░░');
console.log('░░░████████████▒░░▓█▓░░░▒█▓░░░░░░▒██▒░▒██▓░░░░░░▓█▓░░░░░░▒▒▒▒▒▒▒▒▒░░░░░░░░░░▒▒▒░░░░░░░░░▒▒▒▒▒▒▒░░░░░');
console.log('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░');
console.log('░░░▒░░░░░▒░▒░░░▒░░░░▒░░░░░░░░░░░░▒▒▒░░░▒░░░░░▒░░░░░░░░░░░▒░░▒░░░░░▒░░░░░░░▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░');
console.log('░░░▒▒░░░▒░░▒░░░▒░░░░▒░▒░░░▒░░░░░░▒░▒░░░▓▒░░░░▒▒▒░░░░▒▒▒░░▒▒▒▒░░░░░▓░░▒░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░');
console.log(' ');

const app = express();
const pinoHttp = PinoHttp({ logger: logger });
const APP_PORT = process.env.BACKEND_PORT || 4000;
const APP_URL = process.env.BACKEND_URL || 'http://localhost';
const SECRET = process.env.SECURITY_JWT_SECRET || 'RDAsrc23Ia2';
const Auth = new AuthController();

(async () => {
    /* Configurações */
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser(SECRET));
    /* app.use(bodyParser.json()) */
    app.use(pinoHttp);
    app.all('*', ExpressResponseOptions);
    await SetAllowedMethods(app);
    app.use(cors(CORSPolicyOptions));

    /* Rotas */

    app.use('/connection', Auth.authorization, ConnectionRoutes);
    app.use('/user', Auth.authorization, UserRoutes);
    app.use('/auth', AuthRoutes);

    app.use(VerifyFailAuthorization);
    app.use(RouteNotFound);
    app.use(VerifyFailProccess);

    /* Iniciar Servidor */
    app.listen(APP_PORT, () => {
        console.log(`⚡ Servidor Principal Iniciado       | 🌍 ${APP_URL}:${APP_PORT}`);
        logger.info({ APP_URL, APP_PORT }, '⚡ Servidor Iniciado');
    });

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const JWKS = fork(path.join(__dirname, './jwks.ts'), ['-r', 'ts-node/register']);
})();
