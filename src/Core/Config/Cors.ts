import type { CorsOptions } from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();
/**
 * Definição de origem padrão
 * @date 06/04/2023 - 21:34:08
 *
 */
const Origins = String(process.env.FRONTENDS_URL).split(',') || ['http://localhost:3001'];

/**
 * Configuração do Cross-origin Resource Sharing
 * @date 06/04/2023 - 21:34:08
 *
 */
export const CORSPolicyOptions: CorsOptions = {
  origin: Origins,
  allowedHeaders: ['X-Requested-With', 'content-type', 'Authorization'],
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE']
};
