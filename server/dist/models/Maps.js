"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../db/db.config"));
const CellModifiers_1 = __importDefault(require("./CellModifiers"));
const MapCells_1 = __importDefault(require("./MapCells"));
class Maps extends sequelize_1.Model {
    static async generateMap() {
        let map;
        let mapCells = [];
        try {
            map = await Maps.findOrCreate({
                where: { name: 'default' },
                defaults: {
                    name: 'default'
                }
            });
            if (!map)
                throw true;
            const { rows, count } = await MapCells_1.default.findAndCountAll({
                where: {
                    map_id: map[0].id,
                }
            });
            const modifierArray = [
                [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
                [0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 0],
                [0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0],
                [1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1],
                [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
                [0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0],
                [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
                [4, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 4],
                [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
                [0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0],
                [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
                [1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1],
                [0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0],
                [0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 0],
                [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
            ];
            const defaultModifier = await CellModifiers_1.default.getDefaultModifier();
            const cellX2Modifier = await CellModifiers_1.default.getCellX2Modifier();
            const cellX3Modifier = await CellModifiers_1.default.getCellX3Modifier();
            const wordX2Modifier = await CellModifiers_1.default.getWordX2Modifier();
            const wordX3Modifier = await CellModifiers_1.default.getWordX3Modifier();
            if (count !== 225) {
                await MapCells_1.default.destroy({
                    where: {
                        map_id: map[0].id,
                    }
                });
                for (let i = 1; i <= 15; i++) {
                    mapCells.push([]);
                    for (let j = 1; j <= 15; j++) {
                        let correctModifier = null;
                        switch (modifierArray[i - 1][j - 1]) {
                            case 0:
                                correctModifier = defaultModifier;
                                break;
                            case 1:
                                correctModifier = cellX2Modifier;
                                break;
                            case 2:
                                correctModifier = wordX2Modifier;
                                break;
                            case 3:
                                correctModifier = cellX3Modifier;
                                break;
                            case 4:
                                correctModifier = wordX3Modifier;
                                break;
                            default:
                                correctModifier = defaultModifier;
                                break;
                        }
                        const cell = await MapCells_1.default.findOrCreate({
                            where: {
                                map_id: map[0].id,
                                row: i,
                                col: j
                            },
                            defaults: {
                                map_id: map[0].id,
                                cell_modifier_id: correctModifier[0].id,
                                row: i,
                                col: j
                            }
                        });
                        mapCells[i - 1].push({
                            cell: cell[0],
                            modifier: correctModifier[0]
                        });
                    }
                }
            }
            else {
                for (let i = 1; i <= 15; i++) {
                    mapCells.push([]);
                    for (let j = 1; j <= 15; j++) {
                        let correctModifier = null;
                        switch (modifierArray[i - 1][j - 1]) {
                            case 0:
                                correctModifier = defaultModifier;
                                break;
                            case 1:
                                correctModifier = cellX2Modifier;
                                break;
                            case 2:
                                correctModifier = cellX3Modifier;
                                break;
                            case 3:
                                correctModifier = wordX2Modifier;
                                break;
                            case 4:
                                correctModifier = wordX3Modifier;
                                break;
                            default:
                                correctModifier = defaultModifier;
                                break;
                        }
                        const cell = await MapCells_1.default.findAll({
                            where: {
                                map_id: map[0].id,
                                row: i,
                                col: j
                            }
                        });
                        mapCells[i - 1].push({
                            cell: cell[0],
                            modifier: correctModifier[0]
                        });
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            return {
                map,
                mapCells
            };
        }
    }
}
Maps.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: db_config_1.default,
    modelName: 'maps'
});
exports.default = Maps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9NYXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUNBQTZDO0FBQzdDLGdFQUF1QztBQUN2QyxvRUFBNEM7QUFDNUMsMERBQWtDO0FBT2xDLE1BQU0sSUFBSyxTQUFRLGlCQUFLO0lBR3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVztRQUN0QixJQUFJLEdBQUcsQ0FBQztRQUNSLElBQUksUUFBUSxHQUFtQyxFQUFFLENBQUM7UUFDbEQsSUFBSTtZQUNGLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQzVCLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7Z0JBQzFCLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsU0FBUztpQkFDaEI7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFHLENBQUMsR0FBRztnQkFDTCxNQUFNLElBQUksQ0FBQztZQUViLE1BQU0sRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLEdBQUcsTUFBTSxrQkFBUSxDQUFDLGVBQWUsQ0FBQztnQkFDbkQsS0FBSyxFQUFFO29CQUNMLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDbEI7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLGFBQWEsR0FBRztnQkFDcEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFF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