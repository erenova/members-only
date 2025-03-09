const { roleDetails } = require("../utils/userProfile");
const db = require("../db/queries");
const populateDate = require("../utils/dateFormatting");

async function getHome(req, res) {
  const { error, success, errorFloat, successFloat } = req.query;
  let posts = await db.getAllPosts(5);
  let newPosts = [];
  for (let index = 0; index < posts.length; index++) {
    const totalComment = await db.getCommentCountByPost(posts[index].post_id);
    newPosts.push({ ...posts[index], count: Number(totalComment.count) + 1 });
  }
  res.render("index", {
    user: { ...req.user, ...roleDetails[req.user.role] },
    errorFloat: errorFloat,
    error: error,
    success: success,
    successFloat: successFloat,
    posts: populateDate(newPosts),
    roleDetails,
  });
}

module.exports = { getHome };
