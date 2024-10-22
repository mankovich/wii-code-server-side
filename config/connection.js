const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DB_URL) {
  
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',  
    logging: false,       
  });
} else {

  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: "localhost",
      dialect: "postgres",
      port: 5432,           
      logging: false,       
    }
  );
}

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
