import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class CellModifiers extends Model {
  declare id: number;
  declare name: string;
  declare value: number;
  declare description: string;
  declare color: string;
}

CellModifiers.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'cell_modifiers'
});

export default CellModifiers;
