import { SequelizeOptions } from 'sequelize-typescript';
import { logger } from '../Logger';

/**
 * Configurações padrão para o SEQUELIZE
 * @date 06/04/2023 - 21:43:37
 *
 * @type {SequelizeOptions}
 */
let SequelizeConnectionOptions: SequelizeOptions = require('../Database/cli-config')

SequelizeConnectionOptions.logging = msg => logger.info({ Sequelize: msg })

export { SequelizeConnectionOptions }