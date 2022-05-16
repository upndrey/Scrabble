import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Players extends Model {
  declare id: number;
  declare user_id: number;
  declare lobby_id: number;
  declare is_host: boolean;
  declare points: number;
  declare slot: number;
}

Players.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lobby_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_host: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  slot: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'players'
});

export default Players;
