"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../db/db.config"));
const FieldCells_1 = __importDefault(require("./FieldCells"));
class Fields extends sequelize_1.Model {
}
_a = Fields;
Fields.generateField = async (gameId) => {
    let field = null;
    let fieldCells = [];
    try {
        field = await Fields.findOrCreate({
            where: { game_id: gameId },
            defaults: {
                game_id: gameId
            }
        });
        if (!field)
            throw true;
        for (let i = 1; i <= 15; i++) {
            fieldCells.push([]);
            for (let j = 1; j <= 15; j++) {
                const cell = await FieldCells_1.default.findOrCreate({
                    where: {
                        row: i,
                        col: j
                    },
                    defaults: {
                        field_id: field[0].id,
                        row: i,
                        col: j
                    }
                });
                fieldCells[i - 1].push(cell[0]);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        return {
            field,
            fieldCells
        };
    }
};
Fields.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    game_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: db_config_1.default,
    modelName: 'fields'
});
exports.default = Fields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmllbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kZWxzL0ZpZWxkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5Q0FBNkM7QUFDN0MsZ0VBQXVDO0FBQ3ZDLDhEQUFzQztBQUV0QyxNQUFNLE1BQU8sU0FBUSxpQkFBSzs7O0FBR2pCLG9CQUFhLEdBQUcsS0FBSyxFQUFFLE1BQWMsRUFBRSxFQUFFO0lBQzlDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztJQUNqQixJQUFJLFVBQVUsR0FBNkIsRUFBRSxDQUFDO0lBQzlDLElBQUk7UUFDRixLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ2hDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7WUFDMUIsUUFBUSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxNQUFNO2FBQ2hCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxDQUFDLEtBQUs7WUFDUCxNQUFNLElBQUksQ0FBQztRQUdiLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0IsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMzQixNQUFNLElBQUksR0FBRyxNQUFNLG9CQUFVLENBQUMsWUFBWSxDQUFDO29CQUN6QyxLQUFLLEVBQUU7d0JBQ0wsR0FBRyxFQUFFLENBQUM7d0JBQ04sR0FBRyxFQUFFLENBQUM7cUJBQ1A7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDckIsR0FBRyxFQUFFLENBQUM7d0JBQ04sR0FBRyxFQUFFLENBQUM7cUJBQ1A7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pDO1NBQ0Y7S0FDRjtJQUNELE9BQU0sR0FBRyxFQUFFO1FBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNsQjtZQUNPO1FBQ04sT0FBTztZQUNMLEtBQUs7WUFDTCxVQUFVO1NBQ1gsQ0FBQztLQUNIO0FBQ0gsQ0FBQyxDQUFBO0FBR0gsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNWLEVBQUUsRUFBRTtRQUNGLElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87UUFDdkIsYUFBYSxFQUFFLElBQUk7UUFDbkIsVUFBVSxFQUFFLElBQUk7S0FDakI7SUFDRCxPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0NBQ0YsRUFBRTtJQUNELFNBQVMsRUFBVCxtQkFBUztJQUNULFNBQVMsRUFBRSxRQUFRO0NBQ3BCLENBQUMsQ0FBQztBQUVILGtCQUFlLE1BQU0sQ0FBQyJ9