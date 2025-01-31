const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.argv[2] || process.env.DB_URL,
});

module.exports = pool;
