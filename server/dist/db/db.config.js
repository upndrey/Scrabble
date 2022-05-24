"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("scrabble", "root", "", {
    dialect: "mysql",
    host: "localhost",
    logging: false
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZGIvZGIuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQXNDO0FBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUkscUJBQVMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRTtJQUN0RCxPQUFPLEVBQUUsT0FBTztJQUNoQixJQUFJLEVBQUUsV0FBVztJQUNqQixPQUFPLEVBQUUsS0FBSztDQUNmLENBQUMsQ0FBQztBQUVILEtBQUssVUFBVSxJQUFJO0lBQ2pCLElBQUk7UUFDRixNQUFNLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxDQUFDLENBQUM7S0FDOUQ7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDNUQ7QUFDSCxDQUFDO0FBRUQsSUFBSSxFQUFFLENBQUM7QUFDUCxrQkFBZSxTQUFTLENBQUMifQ==