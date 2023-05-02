import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import PinoHttp from 'pino-http';
import routes from '../Routes';
import 'dotenv/config';
import cookieParser = require('cookie-parser');

/* import path from 'path';
import { fork } from 'child_process'; */
import {
    CORSPolicyOptions,
    ExpressResponseOptions,
    SetAllowedMethods,
    VerifyFailAuthorization,
    VerifyFailProccess,
    RouteNotFound
} from '../Core';
import { logger } from '../Services/Logger';

const app = express();
const pinoHttp = PinoHttp({ logger: logger });

const SECRET = process.env.SECURITY_JWT_SECRET || 'RDAsrc23Ia2';

/* Configurações */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(SECRET));
/* app.use(bodyParser.json()) */
app.use(pinoHttp);
app.all('*', ExpressResponseOptions);
SetAllowedMethods(app);
app.use(cors(CORSPolicyOptions));

/* Rotas */
app.use(routes);

app.use(VerifyFailAuthorization);
app.use(RouteNotFound);
app.use(VerifyFailProccess);

export default app;

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
/* const JWKS = fork(path.join(__dirname, './jwks.ts'), ['-r', 'ts-node/register']); */
