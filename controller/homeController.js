const { roleDetails } = require("../utils/userProfile");

function getHome(req, res) {
  const { error, success, errorFloat, successFloat } = req.query;
  res.render("index", {
    user: { ...req.user, ...roleDetails[req.user.role] },
    errorFloat: errorFloat,
    error: error,
    success: success,
    successFloat: successFloat,
  });
}

module.exports = { getHome };
