import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Sets extends Model {
  declare id: number;
  declare name: string;
}

Sets.init({
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
  modelName: 'sets'
});

export default Sets;
