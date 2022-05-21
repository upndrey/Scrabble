"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../db/db.config"));
class Symbols extends sequelize_1.Model {
}
Symbols.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    set_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    in_box: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize: db_config_1.default,
    modelName: 'symbols'
});
exports.default = Symbols;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ltYm9scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9TeW1ib2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUNBQTZDO0FBQzdDLGdFQUF1QztBQUV2QyxNQUFNLE9BQVEsU0FBUSxpQkFBSztDQU0xQjtBQUVELE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDWCxFQUFFLEVBQUU7UUFDRixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLGFBQWEsRUFBRSxJQUFJO1FBQ25CLFVBQVUsRUFBRSxJQUFJO0tBQ2pCO0lBQ0QsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixTQUFTLEVBQUUsS0FBSztLQUNqQjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU07UUFDdEIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixTQUFTLEVBQUUsS0FBSztRQUNoQixZQUFZLEVBQUUsSUFBSTtLQUNuQjtDQUNGLEVBQUU7SUFDRCxTQUFTLEVBQVQsbUJBQVM7SUFDVCxTQUFTLEVBQUUsU0FBUztDQUNyQixDQUFDLENBQUM7QUFFSCxrQkFBZSxPQUFPLENBQUMifQ==