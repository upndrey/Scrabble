import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Users extends Model {
  declare id: number;
  declare login: string;
  declare password: string;
  declare is_online: boolean;
  declare socket_id: string;
}

Users.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_online: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  socket_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'users'
});

export default Users;
