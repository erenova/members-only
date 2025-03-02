const { roleDetails } = require("../utils/userProfile");
const db = require("../db/queries");
const populateDate = require("../utils/dateFormatting");

async function getHome(req, res) {
  const { error, success, errorFloat, successFloat } = req.query;
  const posts = await db.getAllPosts(5);
  res.render("index", {
    user: { ...req.user, ...roleDetails[req.user.role] },
    errorFloat: errorFloat,
    error: error,
    success: success,
    successFloat: successFloat,
    posts: populateDate(posts),
    roleDetails,
  });
}

module.exports = { getHome };
