"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../db/db.config"));
class CellModifiers extends sequelize_1.Model {
}
CellModifiers.getDefaultModifier = async function () {
    const defaultModifier = await CellModifiers.findOrCreate({
        where: {
            name: 'default'
        },
        defaults: {
            name: 'default',
            value: 1,
            color: 'green'
        }
    });
    return defaultModifier;
};
CellModifiers.getCellX2Modifier = async function () {
    const cellX2Modifier = await CellModifiers.findOrCreate({
        where: {
            name: 'cell',
            value: 2
        },
        defaults: {
            name: 'cell',
            value: 2,
            color: 'lightblue'
        }
    });
    return cellX2Modifier;
};
CellModifiers.getCellX3Modifier = async function () {
    const cellX3Modifier = await CellModifiers.findOrCreate({
        where: {
            name: 'cell',
            value: 3
        },
        defaults: {
            name: 'cell',
            value: 3,
            color: 'pink'
        }
    });
    return cellX3Modifier;
};
CellModifiers.getWordX2Modifier = async function () {
    const wordX2Modifier = await CellModifiers.findOrCreate({
        where: {
            name: 'word',
            value: 2
        },
        defaults: {
            name: 'word',
            value: 2,
            color: 'blue'
        }
    });
    return wordX2Modifier;
};
CellModifiers.getWordX3Modifier = async function () {
    const wordX3Modifier = await CellModifiers.findOrCreate({
        where: {
            name: 'word',
            value: 3,
        },
        defaults: {
            name: 'word',
            value: 3,
            color: 'red'
        }
    });
    return wordX3Modifier;
};
CellModifiers.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    color: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: db_config_1.default,
    modelName: 'cell_modifiers'
});
exports.default = CellModifiers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2VsbE1vZGlmaWVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9DZWxsTW9kaWZpZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUNBQTZDO0FBQzdDLGdFQUF1QztBQUV2QyxNQUFNLGFBQWMsU0FBUSxpQkFBSzs7QUFNeEIsZ0NBQWtCLEdBQUcsS0FBSztJQUMvQixNQUFNLGVBQWUsR0FBRyxNQUFNLGFBQWEsQ0FBQyxZQUFZLENBQUM7UUFDdkQsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLFNBQVM7U0FDaEI7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsU0FBUztZQUNmLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxFQUFFLE9BQU87U0FDZjtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU8sZUFBZSxDQUFDO0FBQ3pCLENBQUMsQ0FBQTtBQUVNLCtCQUFpQixHQUFHLEtBQUs7SUFDOUIsTUFBTSxjQUFjLEdBQUcsTUFBTSxhQUFhLENBQUMsWUFBWSxDQUFDO1FBQ3RELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLENBQUM7U0FDVDtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLENBQUM7WUFDUixLQUFLLEVBQUUsV0FBVztTQUNuQjtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU8sY0FBYyxDQUFDO0FBQ3hCLENBQUMsQ0FBQTtBQUVNLCtCQUFpQixHQUFHLEtBQUs7SUFDOUIsTUFBTSxjQUFjLEdBQUcsTUFBTSxhQUFhLENBQUMsWUFBWSxDQUFDO1FBQ3RELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLENBQUM7U0FDVDtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLENBQUM7WUFDUixLQUFLLEVBQUUsTUFBTTtTQUNkO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTyxjQUFjLENBQUM7QUFDeEIsQ0FBQyxDQUFBO0FBRU0sK0JBQWlCLEdBQUcsS0FBSztJQUM5QixNQUFNLGNBQWMsR0FBRyxNQUFNLGFBQWEsQ0FBQyxZQUFZLENBQUM7UUFDdEQsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsQ0FBQztTQUNUO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsQ0FBQztZQUNSLEtBQUssRUFBRSxNQUFNO1NBQ2Q7S0FDRixDQUFDLENBQUM7SUFFSCxPQUFPLGNBQWMsQ0FBQztBQUN4QixDQUFDLENBQUE7QUFFTSwrQkFBaUIsR0FBRyxLQUFLO0lBQzlCLE1BQU0sY0FBYyxHQUFHLE1BQU0sYUFBYSxDQUFDLFlBQVksQ0FBQztRQUN0RCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxDQUFDO1NBQ1Q7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxFQUFFLEtBQUs7U0FDYjtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU8sY0FBYyxDQUFDO0FBQ3hCLENBQUMsQ0FBQTtBQUdILGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDakIsRUFBRSxFQUFFO1FBQ0YsSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixhQUFhLEVBQUUsSUFBSTtRQUNuQixVQUFVLEVBQUUsSUFBSTtLQUNqQjtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU07UUFDdEIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNO1FBQ3RCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTTtRQUN0QixTQUFTLEVBQUUsSUFBSTtLQUNoQjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU07UUFDdEIsU0FBUyxFQUFFLElBQUk7S0FDaEI7Q0FDRixFQUFFO0lBQ0QsU0FBUyxFQUFULG1CQUFTO0lBQ1QsU0FBUyxFQUFFLGdCQUFnQjtDQUM1QixDQUFDLENBQUM7QUFFSCxrQkFBZSxhQUFhLENBQUMifQ==