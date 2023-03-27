import { SequelizeConnection } from "../Utils/DataBase";
import Attendant from "./Attendant";
import User from "./User";

Attendant.associate(SequelizeConnection.models)
User.associate(SequelizeConnection.models)


export {
    Attendant,
    User
}