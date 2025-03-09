const { Router } = require("express");

const router = Router();

const controller = require("../controller/userController");
const auth = require("../middleware/authMiddleware");

router.get("/users", auth.isLoggedIn, controller.getUserList);

module.exports = router;
