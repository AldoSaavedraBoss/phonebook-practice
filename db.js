const config = require('config');
const mysql = require('mysql');
const { promisify } = require('util');

const pool = mysql.createPool({
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  database: config.get('db_name'),
});

pool.getConnection((err, connection) => {
  if (err) throw err;

  if (connection) connection.release();
  console.log('DB is Connected');
  return;
});

pool.query = promisify(pool.query);

module.exports = pool;
