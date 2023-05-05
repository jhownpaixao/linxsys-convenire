import { SequelizeConnection } from '../Database';
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    DataTypes,
    CreationOptional,
    ForeignKey,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
    NonAttribute
} from 'sequelize';
import { User } from './User';
import { Workflow } from './Workflow';
export class Chatbot extends Model<InferAttributes<Chatbot>, InferCreationAttributes<Chatbot>> {
    declare id?: CreationOptional<number>;
    declare name: string;
    declare queues: CreationOptional<object>;
    declare user_id: ForeignKey<User['id']>;
    declare default_messages: object;
    declare workflow_id: ForeignKey<Workflow['id']>;
    declare comments: CreationOptional<string>;
    declare params: CreationOptional<object>;

    declare getWorkflow: BelongsToGetAssociationMixin<Workflow>;
    declare setWorkflow: BelongsToSetAssociationMixin<Workflow, ForeignKey<Workflow['id']>>;
    declare createWorkflow: BelongsToCreateAssociationMixin<Workflow>;
    declare workflow?: NonAttribute<Workflow>;

    static associate() {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(Workflow, { foreignKey: 'workflow_id', as: 'workflow' });
    }
}

Chatbot.init(
    {
        name: DataTypes.STRING,
        queues: DataTypes.JSON,
        user_id: DataTypes.INTEGER,
        default_messages: DataTypes.JSON,
        workflow_id: DataTypes.INTEGER,
        comments: DataTypes.STRING,
        params: DataTypes.JSON
    },
    { sequelize: SequelizeConnection }
);

//Chatbot.sync();
