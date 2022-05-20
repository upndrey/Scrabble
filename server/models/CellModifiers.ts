import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class CellModifiers extends Model {
  declare id: number;
  declare name: string;
  declare value: number;
  declare description: string;
  declare color: string;
  static getDefaultModifier = async function(): Promise<[CellModifiers, boolean]> {
    const defaultModifier = await CellModifiers.findOrCreate({
      where: { 
        name: 'default' 
      },
      defaults: {
        name: 'default',
        value: 1,
        color: 'green'
      }
    });
  
    return defaultModifier;
  }
  
  static getCellX2Modifier = async function(): Promise<[CellModifiers, boolean]> {
    const cellX2Modifier = await CellModifiers.findOrCreate({
      where: { 
        name: 'cell',
        value: 2 
      },
      defaults: {
        name: 'cell',
        value: 2,
        color: 'lightblue'
      }
    });
  
    return cellX2Modifier;
  }
  
  static getCellX3Modifier = async function(): Promise<[CellModifiers, boolean]> {
    const cellX3Modifier = await CellModifiers.findOrCreate({
      where: { 
        name: 'cell',
        value: 3 
      },
      defaults: {
        name: 'cell',
        value: 3,
        color: 'pink'
      }
    });
  
    return cellX3Modifier;
  }

  static getWordX2Modifier = async function(): Promise<[CellModifiers, boolean]> {
    const wordX2Modifier = await CellModifiers.findOrCreate({
      where: { 
        name: 'word',
        value: 2 
      },
      defaults: {
        name: 'word',
        value: 2,
        color: 'blue'
      }
    });
  
    return wordX2Modifier;
  }

  static getWordX3Modifier = async function(): Promise<[CellModifiers, boolean]> {
    const wordX3Modifier = await CellModifiers.findOrCreate({
      where: { 
        name: 'word',
        value: 3,
      },
      defaults: {
        name: 'word',
        value: 3,
        color: 'red'
      }
    });
  
    return wordX3Modifier;
  }
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
