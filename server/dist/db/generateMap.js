"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMap = void 0;
const models_1 = require("./models");
const generateMap = async () => {
    let map;
    try {
        map = await models_1.Maps.findOrCreate({
            where: { name: 'default' },
            defaults: {
                name: 'default'
            }
        });
        if (!map)
            throw true;
        const defaultModifier = await models_1.CellModifiers.findOrCreate({
            where: {
                name: 'default'
            },
            defaults: {
                name: 'default',
                value: 1,
            }
        });
        const cellX2Modifier = await models_1.CellModifiers.findOrCreate({
            where: {
                name: 'cell',
                value: 2
            },
            defaults: {
                name: 'cell',
                value: 2,
            }
        });
        const cellX3Modifier = await models_1.CellModifiers.findOrCreate({
            where: {
                name: 'cell',
                value: 3
            },
            defaults: {
                name: 'cell',
                value: 3,
            }
        });
        const wordX2Modifier = await models_1.CellModifiers.findOrCreate({
            where: {
                name: 'word',
                value: 2
            },
            defaults: {
                name: 'word',
                value: 2,
            }
        });
        const wordX3Modifier = await models_1.CellModifiers.findOrCreate({
            where: {
                name: 'word',
                value: 3,
            },
            defaults: {
                name: 'word',
                value: 3,
            }
        });
        for (let i = 1; i <= 15; i++) {
            for (let j = 1; j <= 15; j++) {
                const cell = await models_1.MapCells.findOrCreate({
                    where: {
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
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        return map;
    }
};
exports.generateMap = generateMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVNYXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9kYi9nZW5lcmF0ZU1hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBd0Q7QUFHakQsTUFBTSxXQUFXLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDcEMsSUFBSSxHQUFHLENBQUM7SUFDUixJQUFJO1FBQ0YsR0FBRyxHQUFHLE1BQU0sYUFBSSxDQUFDLFlBQVksQ0FBQztZQUM1QixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzFCLFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsU0FBUzthQUNoQjtTQUNGLENBQUMsQ0FBQztRQUNILElBQUcsQ0FBQyxHQUFHO1lBQ0wsTUFBTSxJQUFJLENBQUM7UUFFYixNQUFNLGVBQWUsR0FBRyxNQUFNLHNCQUFhLENBQUMsWUFBWSxDQUFDO1lBQ3ZELEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsU0FBUzthQUNoQjtZQUNELFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsU0FBUztnQkFDZixLQUFLLEVBQUUsQ0FBQzthQUNUO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsTUFBTSxzQkFBYSxDQUFDLFlBQVksQ0FBQztZQUN0RCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLE1BQU07Z0JBQ1osS0FBSyxFQUFFLENBQUM7YUFDVDtZQUNELFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsQ0FBQzthQUNUO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsTUFBTSxzQkFBYSxDQUFDLFlBQVksQ0FBQztZQUN0RCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLE1BQU07Z0JBQ1osS0FBSyxFQUFFLENBQUM7YUFDVDtZQUNELFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsQ0FBQzthQUNUO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsTUFBTSxzQkFBYSxDQUFDLFlBQVksQ0FBQztZQUN0RCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLE1BQU07Z0JBQ1osS0FBSyxFQUFFLENBQUM7YUFDVDtZQUNELFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsQ0FBQzthQUNUO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsTUFBTSxzQkFBYSxDQUFDLFlBQVksQ0FBQztZQUN0RCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLE1BQU07Z0JBQ1osS0FBSyxFQUFFLENBQUM7YUFDVDtZQUNELFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsQ0FBQzthQUNUO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMzQixNQUFNLElBQUksR0FBRyxNQUFNLGlCQUFRLENBQUMsWUFBWSxDQUFDO29CQUN2QyxLQUFLLEVBQUU7d0JBQ0wsR0FBRyxFQUFFLENBQUM7d0JBQ04sR0FBRyxFQUFFLENBQUM7cUJBQ1A7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDakIsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3ZDLEdBQUcsRUFBRSxDQUFDO3dCQUNOLEdBQUcsRUFBRSxDQUFDO3FCQUNQO2lCQUNGLENBQUMsQ0FBQzthQUNKO1NBQ0Y7S0FDRjtJQUNELE9BQU0sR0FBRyxFQUFFO1FBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNsQjtZQUNPO1FBQ04sT0FBTyxHQUFHLENBQUM7S0FDWjtBQUNILENBQUMsQ0FBQTtBQXpGWSxRQUFBLFdBQVcsZUF5RnZCIn0=