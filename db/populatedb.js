const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS secrets (
secret_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
secretcode VARCHAR (255),
newrole VARCHAR(255),
level INTEGER
);

CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR (255),
  displayname VARCHAR (255),
  password VARCHAR (255),
  role VARCHAR (255),
  bgcolor VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS posts (
  post_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post VARCHAR (255),
  user_id INTEGER,
  timestamp INTEGER,
  title INTEGER,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS comments (
  comment_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  comment VARCHAR (255),
  user_id INTEGER,
  timestamp INTEGER,
  post_id INTEGER,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE
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
