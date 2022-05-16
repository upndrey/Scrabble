import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Fields extends Model {
  declare id: number;
  declare game_id: number;
}

Fields.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  game_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'fields'
});

export default Fields;
