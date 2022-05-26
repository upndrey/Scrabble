import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Friends extends Model {
  declare user_id: number;
  declare friend_id: number;
  declare is_accepted: boolean;
}

Friends.init({
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  friend_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_accepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'friends'
});

export default Friends;