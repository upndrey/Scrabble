import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Games extends Model {
  declare id: number;
  declare lobby_id: number;
  declare map_id: number;
  declare is_closed: boolean;
  declare turn: number;
}

Games.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  lobby_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  map_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_closed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  turn: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Games'
});

export default Games;
