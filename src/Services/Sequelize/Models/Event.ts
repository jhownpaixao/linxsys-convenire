import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Environment } from './Environment';
export class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  declare id?: CreationOptional<number>;
  declare env_id: ForeignKey<Environment['id']>;
  declare owner_id: string;
  declare data: string;
  declare description: string;
  declare target: number;
  declare method: number;
  declare triggered_at: Date;

  static associate() {
    this.belongsTo(Environment, { foreignKey: 'env_id', as: 'environment' });
  }
}

Event.init(
  {
    env_id: DataTypes.INTEGER,
    owner_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    target: DataTypes.INTEGER,
    data: DataTypes.STRING,
    method: DataTypes.INTEGER,
    triggered_at: DataTypes.DATE
  },
  { sequelize: SequelizeConnection }
);

//Workflow.sync();
