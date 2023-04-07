import { CorsOptions } from "cors";

/**
 * Definição de origem padrão
 * @date 06/04/2023 - 21:34:08
 *
 * @type {*}
 */
const Origins = process.env.FRONTENDS_URL || ['http://localhost:3001'];

/**
 * Configuração do Cross-origin Resource Sharing
 * @date 06/04/2023 - 21:34:08
 *
 * @type {CorsOptions}
 */
export const CORSPolicyOptions: CorsOptions = {
    origin: Origins,
    allowedHeaders: ['X-Requested-With', 'content-type', 'Authorization'],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
}