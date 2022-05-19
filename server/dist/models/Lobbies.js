"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../db/db.config"));
class Lobbies extends sequelize_1.Model {
}
Lobbies.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    host_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    is_private: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    is_closed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    max_players: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2
    }
}, {
    sequelize: db_config_1.default,
    modelName: 'lobbies'
});
exports.default = Lobbies;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9iYmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9Mb2JiaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUNBQTZDO0FBQzdDLGdFQUF1QztBQUV2QyxNQUFNLE9BQVEsU0FBUSxpQkFBSztDQU8xQjtBQUVELE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDWCxFQUFFLEVBQUU7UUFDRixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLGFBQWEsRUFBRSxJQUFJO1FBQ25CLFVBQVUsRUFBRSxJQUFJO0tBQ2pCO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixTQUFTLEVBQUUsS0FBSztLQUNqQjtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU07UUFDdEIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTTtRQUN0QixTQUFTLEVBQUUsSUFBSTtLQUNoQjtJQUNELFNBQVMsRUFBRTtRQUNULElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87UUFDdkIsU0FBUyxFQUFFLEtBQUs7UUFDaEIsWUFBWSxFQUFFLEtBQUs7S0FDcEI7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLFlBQVksRUFBRSxDQUFDO0tBQ2hCO0NBQ0YsRUFBRTtJQUNELFNBQVMsRUFBVCxtQkFBUztJQUNULFNBQVMsRUFBRSxTQUFTO0NBQ3JCLENBQUMsQ0FBQztBQUVILGtCQUFlLE9BQU8sQ0FBQyJ9