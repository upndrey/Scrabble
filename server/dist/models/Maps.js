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
            if (count !== 255) {
                const defaultModifier = await CellModifiers_1.default.getDefaultModifier();
                await MapCells_1.default.destroy({
                    where: {
                        map_id: map[0].id,
                    }
                });
                for (let i = 1; i <= 15; i++) {
                    mapCells.push([]);
                    for (let j = 1; j <= 15; j++) {
                        const cell = await MapCells_1.default.findOrCreate({
                            where: {
                                map_id: map[0].id,
                                row: i,
                                col: j
                            },
                            defaults: {
                                map_id: map[0].id,
                                cell_modifier_id: defaultModifier[0].id,
                                row: i,
                                col: j
                            }
                        });
                        mapCells[i - 1].push(cell[0]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9NYXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUNBQTZDO0FBQzdDLGdFQUF1QztBQUN2QyxvRUFBNEM7QUFDNUMsMERBQWtDO0FBRWxDLE1BQU0sSUFBSyxTQUFRLGlCQUFLO0lBR3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVztRQUN0QixJQUFJLEdBQUcsQ0FBQztRQUNSLElBQUksUUFBUSxHQUEyQixFQUFFLENBQUM7UUFDMUMsSUFBSTtZQUNGLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQzVCLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7Z0JBQzFCLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsU0FBUztpQkFDaEI7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFHLENBQUMsR0FBRztnQkFDTCxNQUFNLElBQUksQ0FBQztZQUViLE1BQU0sRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLEdBQUcsTUFBTSxrQkFBUSxDQUFDLGVBQWUsQ0FBQztnQkFDbkQsS0FBSyxFQUFFO29CQUNMLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDbEI7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFHLEtBQUssS0FBSyxHQUFHLEVBQUU7Z0JBQ2hCLE1BQU0sZUFBZSxHQUFHLE1BQU0sdUJBQWEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUNqRSxNQUFNLGtCQUFRLENBQUMsT0FBTyxDQUFDO29CQUNyQixLQUFLLEVBQUU7d0JBQ0wsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3FCQUNsQjtpQkFDRixDQUFDLENBQUM7Z0JBRUgsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDM0IsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbEIsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDM0IsTUFBTSxJQUFJLEdBQUcsTUFBTSxrQkFBUSxDQUFDLFlBQVksQ0FBQzs0QkFDdkMsS0FBSyxFQUFFO2dDQUNMLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQ0FDakIsR0FBRyxFQUFFLENBQUM7Z0NBQ04sR0FBRyxFQUFFLENBQUM7NkJBQ1A7NEJBQ0QsUUFBUSxFQUFFO2dDQUNSLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQ0FDakIsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQ3ZDLEdBQUcsRUFBRSxDQUFDO2dDQUNOLEdBQUcsRUFBRSxDQUFDOzZCQUNQO3lCQUNGLENBQUMsQ0FBQzt3QkFDSCxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDL0I7aUJBQ0Y7YUFDRjtTQUNGO1FBQ0QsT0FBTSxHQUFHLEVBQUU7WUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO2dCQUNPO1lBQ04sT0FBTztnQkFDTCxHQUFHO2dCQUNILFFBQVE7YUFDVCxDQUFDO1NBQ0g7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ1IsRUFBRSxFQUFFO1FBQ0YsSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixhQUFhLEVBQUUsSUFBSTtRQUNuQixVQUFVLEVBQUUsSUFBSTtLQUNqQjtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU07UUFDdEIsU0FBUyxFQUFFLEtBQUs7S0FDakI7Q0FDRixFQUFFO0lBQ0QsU0FBUyxFQUFULG1CQUFTO0lBQ1QsU0FBUyxFQUFFLE1BQU07Q0FDbEIsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsSUFBSSxDQUFDIn0=