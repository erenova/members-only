const { validationResult, body } = require("express-validator");
const db = require("../db/queries");
const { roleDetails } = require("../utils/userProfile");
const populateDate = require("../utils/dateFormatting");

const titleLengthErr = "Must be between 1 and 32 characters.";
const messageLengthErr = "Must be between 1 and 125 characters.";

const validatePostInput = [
  body("title")
    .ltrim()
    .rtrim()
    .isLength({ min: 1, max: 32 })
    .withMessage(`Title ${titleLengthErr}`),
  body("post")
    .isLength({ min: 1, max: 125 })
    .withMessage(`message ${messageLengthErr}`),
];

async function createNewPost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res
      .status(400)
      .redirect(`/home?errorFloat=${encodeURI(`${errors.array()[0].msg}`)}`);
  }
  const { title, post } = req.body;
  const timestamp = new Date().getTime();
  const slug = encodeURIComponent(title.toLowerCase().replace(/\s|\?/gi, "-"));
  const isSlugValid = await db.isSlugValid(slug);
  if (isSlugValid) {
    const postObject = {
      timestamp,
      slug,
      title,
      post,
      userId: req.user.user_id,
    };
    await db.createNewPost(postObject);
    return res
      .status(200)
      .redirect(
        `/home?successFloat=${encodeURI(`Post successfully created.`)}`,
      );
  } else {
    return res
      .status(400)
      .redirect(
        `/home?errorFloat=${encodeURI(
          `The slug is already in use, please try another title.`,
        )}`,
      );
  }
}

async function getPost(req, res) {
  const { error, success, errorFloat, successFloat } = req.query;

  const { slug } = req.params;
  const postDetails = await db.getPostBySlug(encodeURIComponent(slug));
  if (!postDetails) {
    return res
      .status(400)
      .redirect(`/home?errorFloat=${encodeURI(`No such post.`)}`);
  }
  const author = await db.getUserById(postDetails.user_id);
  let comments = await db.getCommentsByPost(postDetails.post_id);

  comments = populateDate(comments);
  comments = comments.map((item) => {
    return { ...item, ...roleDetails[item.role] };
  });
  res.render("postView", {
    user: { ...req.user, ...roleDetails[req.user.role] },
    post: populateDate(postDetails),
    comments,
    author: { ...author, ...roleDetails[author.role] },
    errorFloat: errorFloat,
    error: error,
    success: success,
    successFloat: successFloat,
  });
}

async function getAllPosts(req, res) {
  const { search } = req.query;
  let posts;
  if (search) {
    posts = await db.searchPost(`%${search}%`);
    console.log(posts);
  } else {
    posts = await db.getAllPosts();
  }
  let newPosts = [];
  for (let index = 0; index < posts.length; index++) {
    const totalComment = await db.getCommentCountByPost(posts[index].post_id);
    newPosts.push({ ...posts[index], count: Number(totalComment.count) + 1 });
  }
  res.render("allPosts", {
    user: { ...req.user, ...roleDetails[req.user.role] },
    posts: populateDate(newPosts),
    roleDetails,
    search,
  });
}

async function deletePost(req, res) {
  const { slug } = req.params;
  const authorId = await db.getPostAuthorId(slug);
  if (
    authorId?.user_id === req?.user?.user_id ||
    req.user.role === "super-admin"
  ) {
    await db.deletePostBySlug(slug);
    res.redirect("/home?successFloat=Post deleted.");
  } else {
    res.redirect("/home?errorFloat=Only the post owner can delete.");
  }
}

module.exports = {
  createNewPost: [validatePostInput, createNewPost],
  getPost,
  getAllPosts,
  deletePost,
};
