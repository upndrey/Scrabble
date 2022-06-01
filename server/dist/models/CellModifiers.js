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
            color: '#1E5945'
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
            color: '#42AAFF'
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
            color: '#EB5284'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2VsbE1vZGlmaWVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9DZWxsTW9kaWZpZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUNBQTZDO0FBQzdDLGdFQUF1QztBQUV2QyxNQUFNLGFBQWMsU0FBUSxpQkFBSzs7QUFNeEIsZ0NBQWtCLEdBQUcsS0FBSztJQUMvQixNQUFNLGVBQWUsR0FBRyxNQUFNLGFBQWEsQ0FBQyxZQUFZLENBQUM7UUFDdkQsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLFNBQVM7U0FDaEI7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsU0FBUztZQUNmLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxFQUFFLFNBQVM7U0FDakI7S0FDRixDQUFDLENBQUM7SUFFSCxPQUFPLGVBQWUsQ0FBQztBQUN6QixDQUFDLENBQUE7QUFFTSwrQkFBaUIsR0FBRyxLQUFLO0lBQzlCLE1BQU0sY0FBYyxHQUFHLE1BQU0sYUFBYSxDQUFDLFlBQVksQ0FBQztRQUN0RCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxDQUFDO1NBQ1Q7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxFQUFFLFNBQVM7U0FDakI7S0FDRixDQUFDLENBQUM7SUFFSCxPQUFPLGNBQWMsQ0FBQztBQUN4QixDQUFDLENBQUE7QUFFTSwrQkFBaUIsR0FBRyxLQUFLO0lBQzlCLE1BQU0sY0FBYyxHQUFHLE1BQU0sYUFBYSxDQUFDLFlBQVksQ0FBQztRQUN0RCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxDQUFDO1NBQ1Q7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxFQUFFLFNBQVM7U0FDakI7S0FDRixDQUFDLENBQUM7SUFFSCxPQUFPLGNBQWMsQ0FBQztBQUN4QixDQUFDLENBQUE7QUFFTSwrQkFBaUIsR0FBRyxLQUFLO0lBQzlCLE1BQU0sY0FBYyxHQUFHLE1BQU0sYUFBYSxDQUFDLFlBQVksQ0FBQztRQUN0RCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxDQUFDO1NBQ1Q7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxFQUFFLE1BQU07U0FDZDtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU8sY0FBYyxDQUFDO0FBQ3hCLENBQUMsQ0FBQTtBQUVNLCtCQUFpQixHQUFHLEtBQUs7SUFDOUIsTUFBTSxjQUFjLEdBQUcsTUFBTSxhQUFhLENBQUMsWUFBWSxDQUFDO1FBQ3RELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLENBQUM7U0FDVDtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLENBQUM7WUFDUixLQUFLLEVBQUUsS0FBSztTQUNiO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTyxjQUFjLENBQUM7QUFDeEIsQ0FBQyxDQUFBO0FBR0gsYUFBYSxDQUFDLElBQUksQ0FBQztJQUNqQixFQUFFLEVBQUU7UUFDRixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLGFBQWEsRUFBRSxJQUFJO1FBQ25CLFVBQVUsRUFBRSxJQUFJO0tBQ2pCO0lBQ0QsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTTtRQUN0QixTQUFTLEVBQUUsS0FBSztLQUNqQjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU07UUFDdEIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNO1FBQ3RCLFNBQVMsRUFBRSxJQUFJO0tBQ2hCO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTTtRQUN0QixTQUFTLEVBQUUsSUFBSTtLQUNoQjtDQUNGLEVBQUU7SUFDRCxTQUFTLEVBQVQsbUJBQVM7SUFDVCxTQUFTLEVBQUUsZ0JBQWdCO0NBQzVCLENBQUMsQ0FBQztBQUVILGtCQUFlLGFBQWEsQ0FBQyJ9