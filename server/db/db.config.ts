import { Sequelize } from "sequelize";
const sequelize = new Sequelize("scrabble", "root", "", {
  dialect: "mysql",
  host: "localhost",
  logging: false
});

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

test();
export default sequelize;