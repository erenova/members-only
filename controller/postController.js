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
  const slug = encodeURI(title.toLowerCase().replace(/ /gi, "-"));
  const isSlugValid = db.isSlugValid(slug);
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
          `The slug is already in use, please change the title.`,
        )}`,
      );
  }
}

async function getPost(req, res) {
  const { slug } = req.params;
  const postDetails = await db.getPostsBySlug(encodeURI(slug));
  const author = await db.getUserById(postDetails.user_id);
  console.log(populateDate(postDetails));
  let comments = [
    {
      comment_id: 101,
      comment: "This is absolutely amazing!",
      user_id: 25,
      username: "john_doe",
      displayname: "John Doe",
      role: "member",
      bgcolor: "bg-blue-500",
      timestamp: 1740889557107,
      post_id: 45,
    },
    {
      comment_id: 102,
      comment: "I totally agree with this!",
      user_id: 30,
      username: "jane_smith",
      displayname: "Jane Smith",
      role: "admin",
      bgcolor: "bg-red-500",
      timestamp: 1740890557107,
      post_id: 45,
    },
    {
      comment_id: 103,
      comment: "Not sure if I understand this part...",
      user_id: 18,
      username: "curious_cat",
      displayname: "Curious Cat",
      role: "member",
      bgcolor: "bg-yellow-400",
      timestamp: 1740891557107,
      post_id: 46,
    },
    {
      comment_id: 104,
      comment: "Great discussion happening here!",
      user_id: 42,
      username: "chatty_guy",
      displayname: "Chatty Guy",
      role: "moderator",
      bgcolor: "bg-green-500",
      timestamp: 1740892557107,
      post_id: 47,
    },
    {
      comment_id: 105,
      comment: "Could you elaborate more on this topic?",
      user_id: 33,
      username: "deep_thinker",
      displayname: "Deep Thinker",
      role: "member",
      bgcolor: "bg-purple-500",
      timestamp: 1740893557107,
      post_id: 48,
    },
  ];
  comments = populateDate(comments);
  res.render("postView", {
    user: { ...req.user, ...roleDetails[req.user.role] },
    post: populateDate(postDetails),
    comments,
    author: { ...author, ...roleDetails[author.role] },
  });
}

module.exports = {
  createNewPost: [validatePostInput, createNewPost],
  getPost,
};
