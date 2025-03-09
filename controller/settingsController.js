const { validationResult, body } = require("express-validator");
const db = require("../db/queries");
const { roleDetails, profileBgColors } = require("../utils/userProfile");

const displayNameErr = "must only contain whitespace, letters or numbers.";
const displayNameLengthErr = "must be less than 16 characters.";

const validateNameInput = [
  body("displayname")
    .ltrim()
    .rtrim()
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage(`display name ${displayNameErr}`)
    .isLength({ min: 1, max: 16 })
    .withMessage(`display name ${displayNameLengthErr}`),
];

async function updateDisplayName(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("settings", {
      user: { ...req.user, ...roleDetails[req.user.role] },
      errorFloat: errors.array()[0].msg,
      colors: profileBgColors,
    });
  }
  const { displayname } = req.body;

  await db.updateDisplayNameById(req.user.user_id, displayname);
  res.redirect("/settings?successFloat=Display name successfully updated.");
}

async function updateColor(req, res) {
  const { color } = req.body;
  if (profileBgColors.includes(color)) {
    await db.updateUserColorById(req.user.user_id, color);
    res.redirect("/settings?successFloat=Profile Color successfully updated.");
  } else {
    res.redirect("/settings?errorFloat=An error occured.");
  }
}

async function getSettings(req, res) {
  const { error, success, errorFloat, successFloat } = req.query;

  res.render("settings", {
    user: { ...req.user, ...roleDetails[req.user.role] },
    errorFloat: errorFloat,
    error: error,
    success: success,
    successFloat: successFloat,
    colors: profileBgColors,
  });
}

module.exports = {
  getSettings,
  updateDisplayName: [validateNameInput, updateDisplayName],
  updateColor,
};
