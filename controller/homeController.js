const { roleDetails } = require("../utils/userProfile");
const db = require("../db/queries");
const getDate = require("../utils/dateFormatting");

async function getHome(req, res) {
  const { error, success, errorFloat, successFloat } = req.query;
  const posts = await db.getAllPosts();
  res.render("index", {
    user: { ...req.user, ...roleDetails[req.user.role] },
    errorFloat: errorFloat,
    error: error,
    success: success,
    successFloat: successFloat,
    posts,
    roleDetails,
    getDate,
  });
}

module.exports = { getHome };
