const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS secrets (
secret_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
secretcode VARCHAR (255),
newrole VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR (255),
  firstname VARCHAR (255),
  lastname VARCHAR (255),
  password VARCHAR (255),
  membertype VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS messages (
  message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message VARCHAR (255),
  user_id INT,
  timestamp VARCHAR (255),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

`;

async function main() {
  const client = new Client({
    connectionString: process.argv[2] || process.env.DB_URL,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Database populated!");
}

main().catch((err) => console.error(err));
