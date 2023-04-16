import { Sequelize } from 'sequelize-typescript';
import { SequelizeConnectionOptions } from '../Config';

export const SequelizeConnection = new Sequelize(SequelizeConnectionOptions);
