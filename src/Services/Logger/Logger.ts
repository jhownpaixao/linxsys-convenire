import * as fs from 'fs';
import { multistream, Streams } from 'pino-multi-stream';
import pino from 'pino';
import { LoggerConfig } from '@Core/Config/Logger';

fs.mkdirSync(LoggerConfig.path, { recursive: true });
/**
 * Streams personalizados para a geração dos logs
 * @date 24/03/2023 - 20:19:18
 *
 */
const streams: Streams = [
    { stream: fs.createWriteStream(LoggerConfig.path + '/all' + LoggerConfig.fileformat) },
    { level: 'debug', stream: fs.createWriteStream(LoggerConfig.path + '/debug' + LoggerConfig.fileformat) },
    { level: 'error', stream: fs.createWriteStream(LoggerConfig.path + '/error' + LoggerConfig.fileformat) },
    { level: 'info', stream: fs.createWriteStream(LoggerConfig.path + '/info' + LoggerConfig.fileformat) },
    { level: 'fatal', stream: fs.createWriteStream(LoggerConfig.path + '/fatal' + LoggerConfig.fileformat) },
    { level: 'warn', stream: fs.createWriteStream(LoggerConfig.path + '/warn' + LoggerConfig.fileformat) },
    { level: 'silent', stream: fs.createWriteStream(LoggerConfig.path + '/silent' + LoggerConfig.fileformat) },
    { level: 'trace', stream: fs.createWriteStream(LoggerConfig.path + '/trace' + LoggerConfig.fileformat) }
];

LoggerConfig.console ?? streams.push({ stream: process.stdout });

/**
 * Logger padrão par a exportação
 * @date 24/03/2023 - 20:19:18
 *
 */
export const logger = pino(
    {
        name: 'linxsys-convenire',
        level: process.env.LOGGER_LEVEL || 'info', // this MUST be set at the lowest level of the
        colorize: true,
        translateTime: 'dd-mm-yyyy HH:MM:ss',
        timestamp: () => `,"time":"${new Date().toJSON()}"`
    },
    multistream(streams)
);
