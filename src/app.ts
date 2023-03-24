import express from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import APIRouter from "./routes/api";
import { logger } from "./components/logger";
import PinoHttp from "pino-http";
const app = express()
const APP_PORT = process.env.PORT || 4000
const APP_URL = process.env.HOSTNAME || 'http://localhost'
const pinoHttp = PinoHttp({ logger: logger })

/* Configurações */
app.use(express.json())
app.use(bodyParser.json())
app.use(pinoHttp)
app.use(cors({
        origin: ['http://localhost:3000']
}))


/* Rotas */
app.use('/api', APIRouter);

/* Iniciar Servidor */
app.listen(APP_PORT, () => {
        console.log(`⚡ Servidor Iniciado| 🖥 ${APP_URL}:${APP_PORT}`)
        logger.info({ APP_URL, APP_PORT }, '⚡ Servidor Iniciado')
})