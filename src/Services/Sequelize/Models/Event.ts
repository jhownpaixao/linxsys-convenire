import { SequelizeConnection } from '../Database';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { User } from './User';
export class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  declare id?: CreationOptional<number>;
  declare user_id: ForeignKey<User['id']>;
  declare owner_id: number;
  declare data: string;
  declare description: string;
  declare target: number;
  declare method: number;
  declare triggered_at: Date;

  static associate() {
    this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  }
}

Event.init(
  {
    user_id: DataTypes.INTEGER,
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
