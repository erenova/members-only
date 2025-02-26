const { Router } = require("express");

const router = Router();
const controller = require("../controller/homeController");
const auth = require("../middleware/authMiddleware");

router.get("/post/new", auth.isLoggedIn, controller.getHome);

module.exports = router;
