import { Sequelize } from 'sequelize-typescript';
import { SequelizeConnectionOptions } from '../../../Core/Config';

export const SequelizeConnection = new Sequelize(SequelizeConnectionOptions);
