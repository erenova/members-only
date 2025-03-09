const { Router } = require("express");

const router = Router();
const controller = require("../controller/postController");
const auth = require("../middleware/authMiddleware");

router.post("/post/new", auth.isLoggedIn, controller.createNewPost);
router.get("/post/:slug", auth.isLoggedIn, controller.getPost);
router.get("/post/", auth.isLoggedIn, controller.getPost);
router.get("/posts/", auth.isLoggedIn, controller.getAllPosts);
router.post("/post/:slug/delete", auth.isLoggedIn, controller.deletePost);

module.exports = router;
