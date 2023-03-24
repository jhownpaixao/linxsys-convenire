import express from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import RoutesConnection from './routes/connection'
import { logger } from "./Utils/logger";
import PinoHttp from "pino-http";
const app = express()
const APP_PORT = process.env.PORT || 4000
const APP_URL = process.env.HOSTNAME || 'http://localhost'
const pinoHttp = PinoHttp({ logger: logger })

/* Configurações */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(pinoHttp)
app.use(cors({
        origin: ['http://localhost:4000']
}))


/* Rotas */
app.use('/connection', RoutesConnection);

/* Iniciar Servidor */
app.listen(APP_PORT, () => {
        console.log(`⚡ Servidor Iniciado| 🖥 ${APP_URL}:${APP_PORT}`)
        logger.info({ APP_URL, APP_PORT }, '⚡ Servidor Iniciado')
})