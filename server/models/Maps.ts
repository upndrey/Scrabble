import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'
import CellModifiers from "./CellModifiers";
import MapCells from "./MapCells";

class Maps extends Model {
  declare id: number;
  declare name: string;
  static async generateMap() {
    let map;
    let mapCells: Array<Array<MapCells>> = [];
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
      if(count !== 255) {
        const defaultModifier = await CellModifiers.getDefaultModifier();
        await MapCells.destroy({
          where: {
            map_id: map[0].id,
          }
        });

        for(let i = 1; i <= 15; i++) {
          mapCells.push([]);
          for(let j = 1; j <= 15; j++) {
            const cell = await MapCells.findOrCreate({
              where: { 
                map_id: map[0].id,
                row: i,
                col: j
              },
              defaults: {
                map_id: map[0].id,
                cell_modifier_id: defaultModifier[0].id,
                row: i,
                col: j
              }
            });
            mapCells[i - 1].push(cell[0]);
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
