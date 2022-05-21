"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../db/db.config"));
class Hands extends sequelize_1.Model {
}
Hands.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    player_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    slot1: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    slot2: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    slot3: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    slot4: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    slot5: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    slot6: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    slot7: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize: db_config_1.default,
    modelName: 'hands'
});
exports.default = Hands;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvSGFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5Q0FBNkM7QUFDN0MsZ0VBQXVDO0FBRXZDLE1BQU0sS0FBTSxTQUFRLGlCQUFLO0NBVXhCO0FBRUQsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNULEVBQUUsRUFBRTtRQUNGLElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87UUFDdkIsYUFBYSxFQUFFLElBQUk7UUFDbkIsVUFBVSxFQUFFLElBQUk7S0FDakI7SUFDRCxTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixTQUFTLEVBQUUsSUFBSTtLQUNoQjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87UUFDdkIsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFNBQVMsRUFBRSxJQUFJO0tBQ2hCO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixTQUFTLEVBQUUsSUFBSTtLQUNoQjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87UUFDdkIsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFNBQVMsRUFBRSxJQUFJO0tBQ2hCO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixTQUFTLEVBQUUsSUFBSTtLQUNoQjtDQUNGLEVBQUU7SUFDRCxTQUFTLEVBQVQsbUJBQVM7SUFDVCxTQUFTLEVBQUUsT0FBTztDQUNuQixDQUFDLENBQUM7QUFFSCxrQkFBZSxLQUFLLENBQUMifQ==