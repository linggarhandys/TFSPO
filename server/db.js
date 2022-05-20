const Pool = require("pg").Pool;

//supabase MM-DD-YYYY

const pool = new Pool({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "praktikum",
});

const pool1 = new Pool({
  user: "postgres",
  password: "Tekfis1965ECS",
  host: "db.blsnjoegcqtrhpqojrip.supabase.co",
  port: 5432,
  database: "postgres",
});

module.exports = pool;
