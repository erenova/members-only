const { validationResult, body } = require("express-validator");
const db = require("../db/queries");

const titleErr = "must only contain letters or numbers.";
const titleLengthErr = "Must be between 1 and 32 characters.";
const messageLengthErr = "Must be between 1 and 125 characters.";

const validatePostInput = [
  body("title")
    .ltrim()
    .rtrim()
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage(`Title ${titleErr}`)
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

module.exports = {
  createNewPost: [validatePostInput, createNewPost],
};
