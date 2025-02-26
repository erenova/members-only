const { Router } = require("express");
const controller = require("../controller/authController");
const asyncHandler = require("express-async-handler");
const { passport } = require("../config/passport");

const router = Router();

router.get("/", controller.getLoginForm);
router.get("/auth/register", controller.getRegisterForm);
router.post("/auth/register", controller.postRegisterForm);
router.get("/auth/login", controller.getLoginForm);
router.post(
  "/auth/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: `/auth/login?error=${encodeURI(
      `Incorrect username or password. Please try again.`,
    )}`,
  }),
);
router.get("/auth/logout", controller.logout);

module.exports = router;
