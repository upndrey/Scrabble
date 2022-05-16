"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("scrabble", "root", "", {
    dialect: "mysql",
    host: "localhost"
});
async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
test();
exports.default = sequelize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZGIvZGIuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQXNDO0FBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUkscUJBQVMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRTtJQUN0RCxPQUFPLEVBQUUsT0FBTztJQUNoQixJQUFJLEVBQUUsV0FBVztDQUNsQixDQUFDLENBQUM7QUFFSCxLQUFLLFVBQVUsSUFBSTtJQUNqQixJQUFJO1FBQ0YsTUFBTSxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0tBQzlEO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzVEO0FBQ0gsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDO0FBQ1Asa0JBQWUsU0FBUyxDQUFDIn0=