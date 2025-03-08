const { Router } = require("express");

const router = Router();
const controller = require("../controller/profileController");
const auth = require("../middleware/authMiddleware");

router.get("/profile", auth.isLoggedIn, controller.getProfile);
router.get("/user/:username", auth.isLoggedIn, controller.getUser);

module.exports = router;
