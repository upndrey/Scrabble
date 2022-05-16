import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Maps extends Model {
  declare id: number;
  declare name: string;
}

Maps.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'maps'
});

export default Maps;
