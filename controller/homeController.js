const { roleDetails } = require("../utils/userProfile");

function getHome(req, res) {
  res.render("index", {
    user: { ...req.user, ...roleDetails[req.user.role] },
  });
}

module.exports = { getHome };
