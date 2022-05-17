"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../db/db.config"));
class MapCells extends sequelize_1.Model {
}
MapCells.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    map_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    cell_modifier_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    row: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    col: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: db_config_1.default,
    modelName: 'map_cells'
});
exports.default = MapCells;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwQ2VsbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvTWFwQ2VsbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5Q0FBNkM7QUFDN0MsZ0VBQXVDO0FBRXZDLE1BQU0sUUFBUyxTQUFRLGlCQUFLO0NBTTNCO0FBRUQsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLEVBQUUsRUFBRTtRQUNGLElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87UUFDdkIsYUFBYSxFQUFFLElBQUk7UUFDbkIsVUFBVSxFQUFFLElBQUk7S0FDakI7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsZ0JBQWdCLEVBQUU7UUFDaEIsSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixTQUFTLEVBQUUsS0FBSztLQUNqQjtJQUNELEdBQUcsRUFBRTtRQUNILElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87UUFDdkIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxHQUFHLEVBQUU7UUFDSCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0NBQ0YsRUFBRTtJQUNELFNBQVMsRUFBVCxtQkFBUztJQUNULFNBQVMsRUFBRSxXQUFXO0NBQ3ZCLENBQUMsQ0FBQztBQUVILGtCQUFlLFFBQVEsQ0FBQyJ9