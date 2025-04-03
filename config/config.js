require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: console.log,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
