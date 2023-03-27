import { Sequelize } from 'sequelize-typescript';
import * as Config from './config'


const SequelizeConfig: object = Config;
export const SequelizeConnection = new Sequelize(SequelizeConfig);