import { SequelizeOptions } from 'sequelize-typescript';
import { logger } from '../../Services/Logger';
import SequelizeConnectionConfig from '../../Services/Sequelize/Database/cli-config';

/**
 * Configurações padrão para o SEQUELIZE
 * @date 06/04/2023 - 21:43:37
 *
 */
const SequelizeConnectionOptions = SequelizeConnectionConfig as SequelizeOptions;

SequelizeConnectionOptions.logging = (msg) => logger.info({ Sequelize: msg });

export { SequelizeConnectionOptions };
