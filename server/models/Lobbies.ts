import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Lobbies extends Model {
  declare id: number;
  declare host_id: number;
  declare name: string;
  declare is_online: boolean;
  declare is_closed: boolean;
}

Lobbies.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  host_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_private: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  is_closed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'lobbies'
});

export default Lobbies;
