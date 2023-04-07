import * as fs from 'fs'
import { multistream, Streams } from 'pino-multi-stream'
import * as path from 'path'
import * as dotenv from 'dotenv'
import moment from 'moment'
import pino from 'pino'
import PinoPretty from 'pino-pretty'
/* import PinoPretty from 'pino-pretty' */
dotenv.config();
/**
 * Define a data atual pelo moment
 * @date 24/03/2023 - 20:19:19
 *
 */
const today: string = moment().format("DD-MM-YYYY");
/**
 * Define a hora atual pelo moment
 * @date 24/03/2023 - 20:19:18
 *
 */
const hour: string = moment().format("HH_mm");
/**
 * Diretório pardrão de logs
 * @date 24/03/2023 - 20:19:18
 *
 */
const dir_log: string = '../../../logs/';

fs.mkdirSync(path.resolve(__dirname, dir_log, today, hour), { recursive: true })
/**
 * Path completo e montado do log atual à ser gerado
 * @date 24/03/2023 - 20:19:18
 *
 */
const path_log: string = path.resolve(__dirname, dir_log, today, hour)

/**
 * Streams personalizados para a geração dos logs
 * @date 24/03/2023 - 20:19:18
 *
 */
const streams: Streams = [
    { stream: fs.createWriteStream(path_log + '/all.log') },
    { level: 'debug', stream: fs.createWriteStream(path_log + '/debug.log') },
    { level: 'error', stream: fs.createWriteStream(path_log + '/error.log') },
    { level: 'info', stream: fs.createWriteStream(path_log + '/info.log') },
    { level: 'fatal', stream: fs.createWriteStream(path_log + '/fatal.log') },
    { level: 'warn', stream: fs.createWriteStream(path_log + '/warn.log') },
    { level: 'silent', stream: fs.createWriteStream(path_log + '/silent.log') },
    { level: 'trace', stream: fs.createWriteStream(path_log + '/trace.log') },
    //{stream: process.stdout},
]

const stream = PinoPretty({
    colorize: true,
})

/**
 * Logger padrão par a exportação
 * @date 24/03/2023 - 20:19:18
 *
 */
export const logger = pino({
    name: 'linxsys-convenire',
    level: process.env.LOGGER_LEVEL || 'info', // this MUST be set at the lowest level of the
    colorize: true,
    translateTime: 'dd-mm-yyyy HH:MM:ss',
    timestamp: () => `,"time":"${new Date().toJSON()}"`,


}, multistream(streams));
