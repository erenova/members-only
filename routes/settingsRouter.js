const { Router } = require("express");

const router = Router();

const controller = require("../controller/settingsController");
const auth = require("../middleware/authMiddleware");

router.get("/settings", auth.isLoggedIn, controller.getSettings);
router.post("/settings/update", auth.isLoggedIn, controller.postSettings);

module.exports = router;
