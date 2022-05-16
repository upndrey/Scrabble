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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBc0M7QUFDdEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO0lBQ3RELE9BQU8sRUFBRSxPQUFPO0lBQ2hCLElBQUksRUFBRSxXQUFXO0NBQ2xCLENBQUMsQ0FBQztBQUVILEtBQUssVUFBVSxJQUFJO0lBQ2pCLElBQUk7UUFDRixNQUFNLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxDQUFDLENBQUM7S0FDOUQ7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDNUQ7QUFDSCxDQUFDO0FBRUQsSUFBSSxFQUFFLENBQUMifQ==