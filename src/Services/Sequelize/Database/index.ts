import { Sequelize } from 'sequelize-typescript';
import { SequelizeConnectionOptions } from '@core/config';

export const SequelizeConnection = new Sequelize(SequelizeConnectionOptions);
