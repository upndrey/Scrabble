import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Hands extends Model {
  declare id: number;
  declare player_id: number;
  declare slot1: number | null;
  declare slot2: number | null;
  declare slot3: number | null;
  declare slot4: number | null;
  declare slot5: number | null;
  declare slot6: number | null;
  declare slot7: number | null;
}

Hands.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  player_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  slot1: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  slot2: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  slot3: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  slot4: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  slot5: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  slot6: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  slot7: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'hands'
});

export default Hands;
