"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require("./Users");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBc0M7QUFDdEMsbUJBQWdCO0FBQ2hCLE1BQU0sU0FBUyxHQUFHLElBQUkscUJBQVMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRTtJQUN0RCxPQUFPLEVBQUUsT0FBTztJQUNoQixJQUFJLEVBQUUsV0FBVztDQUNsQixDQUFDLENBQUM7QUFFSCxLQUFLLFVBQVUsSUFBSTtJQUNqQixJQUFJO1FBQ0YsTUFBTSxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0tBQzlEO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzVEO0FBQ0gsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDIn0=