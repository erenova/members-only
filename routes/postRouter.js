const { Router } = require("express");

const router = Router();
const controller = require("../controller/postController");
const auth = require("../middleware/authMiddleware");

router.post("/post/new", auth.isLoggedIn, controller.createNewPost);
router.get("/post/:slug", auth.isLoggedIn, controller.getPost);

module.exports = router;
