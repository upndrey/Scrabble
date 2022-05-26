import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Lobbies extends Model {
  declare id: number;
  declare host_id: number;
  declare name: string;
  declare password: string;
  declare is_private: boolean;
  declare is_closed: boolean;
  declare max_players: number;
  declare invite_id: string
}

Lobbies.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  host_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_private: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_closed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  max_players: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  invite_id: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'lobbies'
});

export default Lobbies;
