import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import PinoHttp from 'pino-http';
import routes from '../routes';
import 'dotenv/config';
import {
  CORSPolicyOptions,
  ExpressResponseOptions,
  Security,
  SetAllowedMethods,
  handleAuthorizationFailure,
  handleProcessFailure,
  handleRouteNotFound
} from '@core';
import { logger } from '../services/Logger';
import path from 'path';
import { FileService } from '../services/app/FileService';

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

app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));
app.use(handleAuthorizationFailure);
app.use(handleRouteNotFound);
app.use(handleProcessFailure);

// #Start Functions
FileService.init();

export default app;
