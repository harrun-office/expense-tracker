// src/config/db.js
const { Sequelize } = require('sequelize');

const getSequelize = () => {
  // If Railway / provider gives a single connection URL, prefer that
  if (process.env.DATABASE_URL) {
    // Sequelize can accept the full connection string directly
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: false,
      // If your provider requires SSL you can enable it here:
      // dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
    });
  }

  // Fallback to separate env vars
  const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = requiredEnv.filter((k) => !process.env[k]);

  if (missing.length) {
    console.error('Missing required environment variables:', missing.join(', '));
    console.error('Set DATABASE_URL (recommended) or the individual DB_* vars.');
    // Exit with non-zero so deployment fails loudly
    process.exit(1);
  }

  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      dialect: 'mysql',
      logging: false,
      // dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } // uncomment if required
    }
  );
};

const sequelize = getSequelize();

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection has been established successfully.');
    await sequelize.sync();
    console.log('Database synced');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
