import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class FieldCells extends Model {
  declare id: number;
  declare field_id: number;
  declare symbol_id: number;
  declare row: number;
  declare col: number;
}

FieldCells.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  field_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  symbol_id: {
    type: DataTypes.STRING,
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
  modelName: 'field_cells'
});

export default FieldCells;
