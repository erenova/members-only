const { Router } = require("express");

const router = Router();
const controller = require("../controller/profileController");
const auth = require("../middleware/authMiddleware");

router.get("/user/:username", auth.isLoggedIn, controller.getProfile);

module.exports = router;
