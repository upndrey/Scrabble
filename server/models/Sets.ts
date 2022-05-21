import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'
import Symbols from "./Symbols";

class Sets extends Model {
  declare id: number;
  declare game_id: number;
  
  static getSet = async function(game_id: number, in_box: boolean = false) {
    let set = null;
    let symbols = null;
    try {
      set = await Sets.findOne({
        where: { 
          game_id: game_id 
        }
      });
      if(!set)
        throw true;
      if(in_box)
        symbols = await Symbols.findAll({
          attributes: ['id', 'value', 'price', 'in_box'],
          where: {
            set_id: set.id,
            in_box: true
          }
        })
      else 
        symbols = await Symbols.findAll({
          attributes: ['id', 'value', 'price', 'in_box'],
          where: {
            set_id: set.id
          }
        })
    }
    catch(err) {
      console.log(err);
    }
    finally {
      return {
        set,
        symbols
      };
    }
  }
  static generateRuSet = async function(game_id: number) {
    const symbols = [
      ["а",1],["а",1],["а",1],["а",1],["а",1],["а",1],["а",1],["а",1],
      ["б",3],["б",3],
      ["в",1],["в",1],["в",1],
      ["г",3],["г",3],
      ["д",2],["д",2],["д",2],["д",2],
      ["е",1],["е",1],["е",1],["е",1],["е",1],["е",1],["е",1],["е",1],
      ["ё",3],
      ["ж",5],
      ["з",5],["з",5],
      ["и",1],["и",1],["и",1],["и",1],["и",1],
      ["й",4],
      ["к",2],["к",2],["к",2],["к",2],
      ["л",2],["л",2],["л",2],["л",2],
      ["м",2],["м",2],["м",2],
      ["н",1],["н",1],["н",1],["н",1],["н",1],
      ["о",1],["о",1],["о",1],["о",1],["о",1],["о",1],["о",1],["о",1],["о",1],["о",1],
      ["п",2],["п",2],["п",2],["п",2],
      ["р",1],["р",1],["р",1],["р",1],["р",1],
      ["с",1],["с",1],["с",1],["с",1],["с",1],
      ["т",1],["т",1],["т",1],["т",1],["т",1],
      ["у",2],["у",2],["у",2],["у",2],
      ["ф",10],
      ["х",5],
      ["ц",5],
      ["ч",5],
      ["ш",8],
      ["щ",10],
      ["ъ",10],
      ["ы",4],["ы",4],
      ["ь",3],["ь",3],
      ["э",8],
      ["ю",8],
      ["я",3],["я",3],
      ["*",0],["*",0],
    ];
    let set = null;
    try {
      set = await Sets.findOrCreate({
        where: { game_id: game_id },
        defaults: {
          game_id: game_id
        }
      });
      if(!set)
        throw true;
      const {rows, count} = await Symbols.findAndCountAll({
        where: {
          set_id: set[0].id,
        }
      })
      if(count !== symbols.length) {
        await Symbols.destroy({
          where: {
            set_id: set[0].id,
          }
        });

        for(let symbol of symbols) {
          await Symbols.create({
            set_id: set[0].id,
            value: symbol[0],
            price: symbol[1]
          });
        }
      }
    }
    catch(err) {
      console.log(err);
    }
    finally {
      return {
        set,
        symbols
      };
    }
  }
}

Sets.init({
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
  modelName: 'sets'
});

export default Sets;
