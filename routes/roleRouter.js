const { Router } = require("express");

const router = Router();

const controller = require("../controller/roleController");
const auth = require("../middleware/authMiddleware");

router.post("/user/role", auth.isLoggedIn, controller.assignNewRole);
 router.post("/user/jerk", auth.isLoggedIn, controller.assignJerkMember);

module.exports = router;
