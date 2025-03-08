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

async function getAllPosts(limit) {
  let limitText = "";
  if (limit) {
    limitText = `LIMIT ${limit}`;
  }
  const posts = await pool.query(
    `
SELECT post_id, post, a.user_id, timestamp, title, slug, b.username, b.displayname,b.role,b.bgcolor FROM posts a
 JOIN users b ON a.user_id = b.user_id ORDER BY timestamp DESC ${limitText}`,
  );
  return posts.rows;
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
async function getUserById(user_id) {
  const user = await pool.query(
    `SELECT user_id,username,displayname,role,bgcolor FROM users WHERE user_id = $1`,
    [user_id],
  );
  return user.rows[0];
}

async function getPostBySlug(slug) {
  const post = await pool.query(`SELECT * FROM posts WHERE slug = $1`, [slug]);
  return post.rows[0];
}

async function getCommentsByPost(post_id) {
  const comments = await pool.query(
    ` SELECT * FROM comments 
   JOIN users ON users.user_id = comments.user_id
    WHERE post_id = $1`,
    [post_id],
  );
  return comments.rows;
}

async function getCommentCountByPost(post_id) {
  const count = await pool.query(
    `SELECT COUNT(comments.comment) FROM comments 
   JOIN users ON users.user_id = comments.user_id
    WHERE post_id = $1`,
    [post_id],
  );
  return count.rows[0];
}

async function createNewComment(commentObject) {
  const { comment, timestamp, user_id, post_id } = commentObject;
  await pool.query(
    `
        INSERT INTO comments (comment, user_id, post_id, timestamp)
        VALUES ($1,$2,$3,$4)
        `,
    [comment, user_id, post_id, timestamp],
  );
}
async function searchPost(search) {
  const result = await pool.query(
    `SELECT post_id, post, a.user_id, timestamp, title, slug, b.username, b.displayname,b.role,b.bgcolor FROM posts a
 JOIN users b ON a.user_id = b.user_id
 WHERE title ILIKE $1 ORDER BY timestamp DESC`,
    [search],
  );
  return result.rows;
}

module.exports = {
  isUsernameValid,
  registerNewUser,
  assignRole,
  getRole,
  isSlugValid,
  assignDirectRole,
  createNewPost,
  getAllPosts,
  getUserById,
  getPostBySlug,
  createNewComment,
  getCommentsByPost,
  getCommentCountByPost,
  searchPost,
};
