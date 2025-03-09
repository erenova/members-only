const { roleDetails } = require("../utils/userProfile");
const db = require("../db/queries");
const populateDate = require("../utils/dateFormatting");

async function getProfile(req, res) {
  const { error, success, errorFloat, successFloat } = req.query;
  const { username } = req.params;
  const posts = await db.getUserPosts(username);
  let newPosts = [];
  for (let index = 0; index < posts.length; index++) {
    const totalComment = await db.getCommentCountByPost(posts[index].post_id);
    newPosts.push({ ...posts[index], count: Number(totalComment.count) + 1 });
  }
  res.render("userProfile", {
    user: { ...req.user, ...roleDetails[req.user.role] },
    errorFloat: errorFloat,
    error: error,
    posts: populateDate(newPosts),
    success: success,
    successFloat: successFloat,
    roleDetails,
    username,
  });
}

module.exports = {
  getProfile,
};
