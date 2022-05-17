import { DataTypes, Model } from "sequelize";
import sequelize from '../db/db.config'

class Friends extends Model {
  declare user_id: number;
  declare friend_id: number;
}

Friends.init({
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  friend_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'friends'
});

export default Friends;