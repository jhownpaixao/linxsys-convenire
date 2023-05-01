import { SequelizeOptions } from 'sequelize-typescript';
import { logger } from '../../Services/Logger';

/**
 * Configurações padrão para o SEQUELIZE
 * @date 06/04/2023 - 21:43:37
 *
 * @type {SequelizeOptions}
 */
import SequelizeConnectionConfig from '../../Services/Sequelize/Database/cli-config';

const SequelizeConnectionOptions = SequelizeConnectionConfig as SequelizeOptions;
SequelizeConnectionOptions.logging = (msg) => logger.info({ Sequelize: msg });

export { SequelizeConnectionOptions };
