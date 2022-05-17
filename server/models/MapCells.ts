import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class MapCells extends Model {
  declare id: number;
  declare map_id: number;
  declare cell_modifier_id: number;
  declare row: number;
  declare col: number;
}

MapCells.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  map_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cell_modifier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  row: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  col: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'map_cells'
});

export default MapCells;
