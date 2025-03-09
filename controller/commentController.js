const { validationResult, body } = require("express-validator");
const db = require("../db/queries");
const { roleDetails } = require("../utils/userProfile");
const populateDate = require("../utils/dateFormatting");

const commentLengthErr = "Must be between 1 and 125 characters.";

const validateCommentInput = [
  body("comment")
    .ltrim()
    .rtrim()
    .isLength({ min: 1, max: 126 })
    .withMessage(`Comment ${commentLengthErr}`),
];

async function createNewComment(req, res) {
  const { slug, post_id } = req.params;
  const { comment } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res
      .status(400)
      .redirect(
        `/post/${slug}?errorFloat=${encodeURI(`${errors.array()[0].msg}`)}`,
      );
  }
  const timestamp = new Date().getTime();
  const user_id = req.user.user_id;
  const commentObj = {
    post_id,
    user_id,
    timestamp,
    comment,
  };
  await db.createNewComment(commentObj);

  res.redirect(`/post/${slug}`);
}

module.exports = {
  createNewComment: [validateCommentInput, createNewComment],
};
