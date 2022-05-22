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
                        col: j,
                        field_id: field[0].id
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmllbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kZWxzL0ZpZWxkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5Q0FBNkM7QUFDN0MsZ0VBQXVDO0FBQ3ZDLDhEQUFzQztBQUV0QyxNQUFNLE1BQU8sU0FBUSxpQkFBSzs7O0FBR2pCLG9CQUFhLEdBQUcsS0FBSyxFQUFFLE1BQWMsRUFBRSxFQUFFO0lBQzlDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztJQUNqQixJQUFJLFVBQVUsR0FBNkIsRUFBRSxDQUFDO0lBQzlDLElBQUk7UUFDRixLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ2hDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7WUFDMUIsUUFBUSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxNQUFNO2FBQ2hCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxDQUFDLEtBQUs7WUFDUCxNQUFNLElBQUksQ0FBQztRQUdiLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0IsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMzQixNQUFNLElBQUksR0FBRyxNQUFNLG9CQUFVLENBQUMsWUFBWSxDQUFDO29CQUN6QyxLQUFLLEVBQUU7d0JBQ0wsR0FBRyxFQUFFLENBQUM7d0JBQ04sR0FBRyxFQUFFLENBQUM7d0JBQ04sUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3FCQUN0QjtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUNyQixHQUFHLEVBQUUsQ0FBQzt3QkFDTixHQUFHLEVBQUUsQ0FBQztxQkFDUDtpQkFDRixDQUFDLENBQUM7Z0JBQ0gsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDakM7U0FDRjtLQUNGO0lBQ0QsT0FBTSxHQUFHLEVBQUU7UUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2xCO1lBQ087UUFDTixPQUFPO1lBQ0wsS0FBSztZQUNMLFVBQVU7U0FDWCxDQUFDO0tBQ0g7QUFDSCxDQUFDLENBQUE7QUFHSCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ1YsRUFBRSxFQUFFO1FBQ0YsSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixhQUFhLEVBQUUsSUFBSTtRQUNuQixVQUFVLEVBQUUsSUFBSTtLQUNqQjtJQUNELE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87UUFDdkIsU0FBUyxFQUFFLEtBQUs7S0FDakI7Q0FDRixFQUFFO0lBQ0QsU0FBUyxFQUFULG1CQUFTO0lBQ1QsU0FBUyxFQUFFLFFBQVE7Q0FDcEIsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsTUFBTSxDQUFDIn0=