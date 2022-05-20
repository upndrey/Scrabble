import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'
import FieldCells from "./FieldCells";

class Fields extends Model {
  declare id: number;
  declare game_id: number;
  static generateField = async (gameId: number) => {
    let field = null;
    let fieldCells: Array<Array<FieldCells>> = [];
    try {
      field = await Fields.findOrCreate({
        where: { game_id: gameId },
        defaults: {
          game_id: gameId
        }
      });
      if(!field)
        throw true;
  
  
      for(let i = 1; i <= 15; i++) {
        fieldCells.push([]);
        for(let j = 1; j <= 15; j++) {
          const cell = await FieldCells.findOrCreate({
            where: { 
              row: i,
              col: j
            },
            defaults: {
              field_id: field[0].id,
              row: i,
              col: j
            }
          });
          fieldCells[i - 1].push(cell[0]);
        }
      }
    }
    catch(err) {
      console.log(err);
    }
    finally {
      return {
        field,
        fieldCells
      };
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
