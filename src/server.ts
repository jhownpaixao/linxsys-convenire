import app from './app';
import { logger } from './services/Logger';
import { ServerConfig } from '@core';

/* Iniciar Servidor */
app.listen(ServerConfig.MAIN_PORT, () => {
  console.log(
    `⚡ Convenire-API Iniciado     | 🌍 ${ServerConfig.HOST_ADDRESS}:${ServerConfig.MAIN_PORT}`
  );
  logger.info(
    { Port: ServerConfig.MAIN_PORT, Address: ServerConfig.HOST_ADDRESS },
    '⚡ Convenire-API Iniciado'
  );
});
