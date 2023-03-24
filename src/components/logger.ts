import * as fs from 'fs'
import { multistream, Streams } from 'pino-multi-stream'
import * as path from 'path'
import moment from 'moment'
import pino from 'pino'
import PinoPretty from 'pino-pretty'


const today = moment().format("DD-MM-YYYY");
const hour = moment().format("hh_mm");
const dir_log = '../logs/';

fs.mkdirSync(path.resolve(__dirname, dir_log, today, hour), { recursive: true })
const path_log = path.resolve(__dirname, dir_log, today, hour)

const streams: Streams = [
    { stream: fs.createWriteStream(path_log + '/all-' + hour + '.log') },
    { level: 'debug', stream: fs.createWriteStream(path_log + '/debug-' + hour + '.log') },
    { level: 'error', stream: fs.createWriteStream(path_log + '/error-' + hour + '.log') },
    { level: 'info', stream: fs.createWriteStream(path_log + '/info-' + hour + '.log') },
    { level: 'fatal', stream: fs.createWriteStream(path_log + '/fatal-' + hour + '.log') },
    //{stream: process.stdout},
]

export const logger = pino( {
    name: 'linxsys-convenire',
    level: process.env.LOGGER_LEVEL || 'info', // this MUST be set at the lowest level of the
    colorize: true,
    translateTime: 'dd-mm-yyyy HH:MM:ss',
    timestamp: () => `,"time":"${new Date().toJSON()}"`,
    
}, multistream(streams));
