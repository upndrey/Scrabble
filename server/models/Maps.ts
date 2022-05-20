import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'
import CellModifiers from "./CellModifiers";
import MapCells from "./MapCells";

interface MapCellsModified {
  cell: MapCells,
  modifier: CellModifiers
}

class Maps extends Model {
  declare id: number;
  declare name: string;
  static async generateMap() {
    let map;
    let mapCells: Array<Array<MapCellsModified>> = [];
    try {
      map = await Maps.findOrCreate({
        where: { name: 'default' },
        defaults: {
          name: 'default'
        }
      });
      if(!map)
        throw true;
      
      const {rows, count} = await MapCells.findAndCountAll({
        where: {
          map_id: map[0].id,
        }
      });
      const modifierArray = [
        [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
        [0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 0],
        [0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0],
        [1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1],
        [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
        [0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0],
        [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
        [4, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 4],
        [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
        [0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0],
        [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
        [1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1],
        [0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0],
        [0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 0],
        [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
      ];
      const defaultModifier = await CellModifiers.getDefaultModifier();
      const cellX2Modifier = await CellModifiers.getCellX2Modifier();
      const cellX3Modifier = await CellModifiers.getCellX3Modifier();
      const wordX2Modifier = await CellModifiers.getWordX2Modifier();
      const wordX3Modifier = await CellModifiers.getWordX3Modifier();

      if(count !== 225) {
        await MapCells.destroy({
          where: {
            map_id: map[0].id,
          }
        });

        
        for(let i = 1; i <= 15; i++) {
          mapCells.push([]);
          for(let j = 1; j <= 15; j++) {
            let correctModifier = null;
            switch(modifierArray[i - 1][j - 1]) {
              case 0:
                correctModifier = defaultModifier;
                break;
              case 1:
                correctModifier = cellX2Modifier;
                break;
              case 2:
                correctModifier = cellX3Modifier;
                break;
              case 3:
                correctModifier = wordX2Modifier;
                break;
              case 4:
                correctModifier = wordX3Modifier;
                break;
              default: 
                correctModifier = defaultModifier;
                break;
            }
            const cell = await MapCells.findOrCreate({
              where: { 
                map_id: map[0].id,
                row: i,
                col: j
              },
              defaults: {
                map_id: map[0].id,
                cell_modifier_id: correctModifier[0].id,
                row: i,
                col: j
              }
            });
            mapCells[i - 1].push({
              cell: cell[0], 
              modifier: correctModifier[0]
            });
          }
        }
      }
      else {
        for(let i = 1; i <= 15; i++) {
          mapCells.push([]);
          for(let j = 1; j <= 15; j++) {
            let correctModifier = null;
            switch(modifierArray[i - 1][j - 1]) {
              case 0:
                correctModifier = defaultModifier;
                break;
              case 1:
                correctModifier = cellX2Modifier;
                break;
              case 2:
                correctModifier = cellX3Modifier;
                break;
              case 3:
                correctModifier = wordX2Modifier;
                break;
              case 4:
                correctModifier = wordX3Modifier;
                break;
              default: 
                correctModifier = defaultModifier;
                break;
            }
            const cell = await MapCells.findAll({
              where: { 
                map_id: map[0].id,
                row: i,
                col: j
              }
            });
            mapCells[i - 1].push({
              cell: cell[0],
              modifier: correctModifier[0]
            });
          }
        }
      }
    }
    catch(err) {
      console.log(err);
    }
    finally {
      return {
        map,
        mapCells
      };
    }
  }
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
