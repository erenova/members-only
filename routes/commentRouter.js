const { Router } = require("express");

const router = Router();
const controller = require("../controller/commentController");
const auth = require("../middleware/authMiddleware");

router.post(
  "/comment/:slug/:post_id",
  auth.isLoggedIn,
  controller.createNewComment,
);

module.exports = router;
