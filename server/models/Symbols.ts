import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Symbols extends Model {
  declare id: number;
  declare set_id: number;
  declare value: string;
  declare price: number;
  declare in_box: boolean;
}

Symbols.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  set_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  in_box: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'symbols'
});

export default Symbols;
