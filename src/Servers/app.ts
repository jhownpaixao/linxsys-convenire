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
import { logger } from '../services/Logger';
import path from 'path';
import { FileService } from '../services/app/FileService';
import AsteriskManager from '../services/AsteriskService/AsteriskManager';
import { AsteriskService } from '../services/AsteriskService/AsteriskService';

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
/* const asm = new AsteriskManager({
  host: '200.150.205.1',
  port: 5038,
  username: 'api',
  password: 'voip123'
}); */

/* (async () => {
  const service = await AsteriskService.init('5');
  await service.connect();
  console.log(await service.asm.command('core show channels concise'));
  await service.showActiveCalls();
})(); */

export default app;
