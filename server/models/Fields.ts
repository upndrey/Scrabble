import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'
import FieldCells from "./FieldCells";

class Fields extends Model {
  declare id: number;
  declare game_id: number;

  async generateDefaultField(game_id: number) {
    const field = await Fields.create({game_id});
    for(let i = 0; i < 15; i++) {
      for(let j = 0; j < 15; j++) {
        await FieldCells.create({
          field_id: field.id,
          row: i,
          col: j
        })
      }
    }
  }
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
