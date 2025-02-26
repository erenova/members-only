const pool = require("./pool");

async function isUsernameValid(username) {
  const res = await pool.query(
    "SELECT username FROM users WHERE username = $1;",
    [username],
  );

  return !res.rows[0];
}

async function registerNewUser(userObject) {
  const { username, displayname, password, bgcolor } = userObject;
  await pool.query(
    `
        INSERT INTO users (username, displayname, password, role, bgcolor)
        VALUES ($1,$2,$3,$4,$5)
        `,
    [username, displayname, password, "member", bgcolor],
  );
}

async function getRole(secretCode) {
  const role = await pool.query(
    `
      SELECT * FROM secrets WHERE secretcode = $1;
    `,
    [secretCode],
  );
  return role.rows[0];
}

async function isSlugValid(slug) {
  const post = await pool.query(
    `
      SELECT * FROM posts WHERE slug = $1;
      `,
    [slug],
  );
  return !post.rows[0];
}

async function createNewPost(postObject) {
  const { title, post, timestamp, userId, slug } = postObject;
  await pool.query(
    `
        INSERT INTO posts (title,post,timestamp,user_id,slug)
        VALUES ($1,$2,$3,$4,$5)
        `,
    [title, post, timestamp, userId, slug],
  );
}

async function assignRole(username, secretCode) {
  const res = await getRole(secretCode);
  if (res) {
    console.log(username);
    const { newrole } = res;
    await pool.query(
      `
      UPDATE users SET role = $1 WHERE username = $2;`,
      [newrole, username],
    );
  }
}
async function assignDirectRole(username, role) {
  await pool.query(
    `
      UPDATE users SET role = $1 WHERE username = $2;`,
    [role, username],
  );
}

module.exports = {
  isUsernameValid,
  registerNewUser,
  assignRole,
  getRole,
  isSlugValid,
  assignDirectRole,
  createNewPost,
};
