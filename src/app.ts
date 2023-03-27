import express, { NextFunction, Request, Response } from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import { logger } from "./Utils/Logger";
import PinoHttp from "pino-http";
import { SendHTTPResponse } from "./Utils/Responses";
import RoutesConnection from './routes/connection'
import RoutesUser from './routes/user'



console.log('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓███████████████████▓░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▓██▒░░░░░░░░░░░░░░▒▒░░░░░░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▒▒▒░░░░▒▒░▒▒▓▓▓▒░░░░▓██▓░░░░░░▒▒▒░░░▒▒▒░░░░░░░░░▒▒░░░░░░░░░░░░░░░░░░░░░▒▒▒▒░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓██▓▓▓███▓░░░▒███░░░░▓██░░░░░▒▒▒░░░░░░░░░░░░░░▒▒░░░░░░░▒▒▒░░░▒▒▒▒░▒▒▒▒░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓██▒░░░░░▓██▒░░░░▓██▒▒██▓░░░░░░░░▒▒▒▒▒▒▒▒░░░░░░░░▒▒░░░░░░▒▒░░░▒▒░░░░░░░▒░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓██░░░░░░▒██▒░░░░░▒████▒░░░░░░░░░░░░░░░▒▒▒▒▒░░░░░░▒▒░░░░▒▒░░░░░▒▒▒▒▒▒░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░░░░▓███▒░░░░░░░░░░░░░░░░░░▒▒▒░░░░░▒▒░░░▒▒▒░░░░░░░▒▒▒▒▒▒▒░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░░▒██▒▒██▓░░░░░▒▒░░░░░░░░░░░▒▒░░░░░░▒▒░▒▒▒░░░░░░░░░░░░░▒▒▒░░░')
console.log('░░░███▒▒▒▒▒▒▒▒▒░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░▓██▒░░░▓█▓░░░░░▒▒▒▒░░░░░░▒▒▒░░░░░░░▒▒▒▒▒░░░░░░▒▒▒░░░░░▒▒▒░░░')
console.log('░░░████████████▒░░▓█▓░░░▒█▓░░░░░░▒██▒░▒██▓░░░░░░▓█▓░░░░░░▒▒▒▒▒▒▒▒▒░░░░░░░░░░▒▒▒░░░░░░░░░▒▒▒▒▒▒▒░░░░░')
console.log('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░▒░░░░░▒░▒░░░▒░░░░▒░░░░░░░░░░░░▒▒▒░░░▒░░░░░▒░░░░░░░░░░░▒░░▒░░░░░▒░░░░░░░▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░▒▒░░░▒░░▒░░░▒░░░░▒░▒░░░▒░░░░░░▒░▒░░░▓▒░░░░▒▒▒░░░░▒▒▒░░▒▒▒▒░░░░░▓░░▒░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░')



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
app.use('/user', RoutesUser);



app.use((req: Request, res: Response, next: NextFunction) => {
        SendHTTPResponse({ message: 'Rota não encontrado', type: 'error', status: false, code: 404 }, res)
})



/* Iniciar Servidor */
app.listen(APP_PORT, () => {
        console.log(`⚡ Servidor Iniciado| 🖥 ${APP_URL}:${APP_PORT}`)
        logger.info({ APP_URL, APP_PORT }, '⚡ Servidor Iniciado')
})