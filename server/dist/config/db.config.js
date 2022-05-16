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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vY29uZmlnL2RiLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFzQztBQUN0QyxNQUFNLFNBQVMsR0FBRyxJQUFJLHFCQUFTLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUU7SUFDdEQsT0FBTyxFQUFFLE9BQU87SUFDaEIsSUFBSSxFQUFFLFdBQVc7Q0FDbEIsQ0FBQyxDQUFDO0FBRUgsS0FBSyxVQUFVLElBQUk7SUFDakIsSUFBSTtRQUNGLE1BQU0sU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLENBQUMsQ0FBQztLQUM5RDtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM1RDtBQUNILENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQztBQUNQLGtCQUFlLFNBQVMsQ0FBQyJ9