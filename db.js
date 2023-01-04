require('dotenv').config();
const Pool = require('pg').Pool;

const pool = new Pool({
  host: 'localhost',
  user: 'carterbrooks',
  database: 'qa',
  password: '',
  port: 5432,
})

module.exports.pool = pool;