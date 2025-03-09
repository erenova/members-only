const { Router } = require("express");

const router = Router();

const controller = require("../controller/settingsController");
const auth = require("../middleware/authMiddleware");

router.get("/settings", auth.isLoggedIn, controller.getSettings);
router.post(
  "/settings/update/displayname",
  auth.isLoggedIn,
  controller.updateDisplayName,
);
router.post("/settings/update/color", auth.isLoggedIn, controller.updateColor);

module.exports = router;
