// check_db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const cfg = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
    console.log('Connecting to', cfg.host + ':' + cfg.port, 'db:', cfg.database);
    const conn = await mysql.createConnection(cfg);

    const [tables] = await conn.query(`SHOW TABLES`);
    if (!tables.length) {
      console.log('No tables found.');
      await conn.end();
      return;
    }

    console.log('\nTables:');
    console.table(tables);

    // The key name is usually `Tables_in_<dbname>`; handle generically
    const keyName = Object.keys(tables[0])[0];

    for (const row of tables) {
      const tableName = row[keyName];
      console.log('\nDESCRIBE', tableName);
      const [desc] = await conn.query(`DESCRIBE \`${tableName}\``);
      console.table(desc);
    }

    await conn.end();
  } catch (err) {
    console.error('Error:', err.message || err);
    console.error(err);
  }
})();
