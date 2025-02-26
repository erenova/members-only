function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .redirect(
        `/auth/login?warn=${encodeURIComponent(`Please Log in first.`)}`,
      );
  }
}

module.exports = {
  isLoggedIn,
};

/* module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({ msg: "You're not authorized to view this resource" });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.status(401).json({ msg: "You're not an admin." });
  }
};
 */
