import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import PinoHttp from 'pino-http';
import routes from '../routes';
import 'dotenv/config';
import {
    CORSPolicyOptions,
    ExpressResponseOptions,
    SetAllowedMethods,
    handleAuthorizationFailure,
    handleProcessFailure,
    handleRouteNotFound
} from '@core';
import { logger } from '../services/logger';

const app = express();
const pinoHttp = PinoHttp({ logger: logger });

/* Configurações */
app.all('*', ExpressResponseOptions); //set json response type
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(pinoHttp);

SetAllowedMethods(app);
app.use(cors(CORSPolicyOptions));

/* Rotas */
app.use(routes);
app.use(handleAuthorizationFailure);
app.use(handleRouteNotFound);
app.use(handleProcessFailure);

export default app;
