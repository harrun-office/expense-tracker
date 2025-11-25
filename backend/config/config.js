// config/config.js
require('dotenv').config(); // <-- ensure .env is loaded when sequelize-cli reads this file

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'database_development',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
  },

  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'database_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
  },

  production: {
    // Do NOT provide local defaults here — require the env vars to be present.
    // This prevents sequelize-cli from silently trying root@localhost (using no password).
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    dialect: process.env.DB_DIALECT || 'mysql',

    // If you prefer using a single connection URL (Railway gives one), set DATABASE_URL in your .env:
    // DATABASE_URL="mysql://user:pass@host:port/dbname"
    // and uncomment the line below to let sequelize use it:
    // use_env_variable: process.env.DATABASE_URL ? 'DATABASE_URL' : undefined,

    dialectOptions: {
      // Optionally add connectTimeout or other options if needed:
      connectTimeout: 60000
    }
  }
};
