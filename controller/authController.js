const { validationResult, body } = require("express-validator");
const { bcrypt } = require("../config/passport");
const db = require("../db/queries");
const { pickBgColor } = require("../utils/userProfile");

const usernameErr = "must only contain letters or numbers.";
const displayNameErr = "must only contain whitespace, letters or numbers.";
const usernameLengthErr =
  "must be at least 3 characters and maximum of 15 characters.";
const displayNameLengthErr = "must be maximum of 15 characters.";
const passLengthErr = "must be at least 3 characters.";

const validateRegInput = [
  body("username")
    .trim()
    .isAlphanumeric()
    .withMessage(`User name ${usernameErr}`)
    .isLength({ min: 3, max: 15 })
    .withMessage(`User name ${usernameLengthErr}`),
  body("displayname")
    .ltrim()
    .rtrim()
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage(`display name ${displayNameErr}`)
    .isLength({ min: 1, max: 15 })
    .withMessage(`display name ${displayNameLengthErr}`),
  body("password")
    .trim()
    .isLength({ min: 3 })
    .withMessage(`Password ${passLengthErr}`),
];

function getRegisterForm(req, res) {
  const queryMessage = req?.query?.error;
  if (req.user) {
    res.redirect("/home");
  } else {
    res.render("register", {
      error: queryMessage,
    });
  }
}

async function postRegisterForm(req, res) {
  const errors = validationResult(req);
  const { username, displayname, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render("register", {
      error: errors.array()[0].msg,
      username,
      displayname,
      password,
    });
  }

  const bgcolor = pickBgColor();
  const formattedUsername = username.toLowerCase();
  const isNameValid = await db.isUsernameValid(formattedUsername);
  if (isNameValid) {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.registerNewUser({
      username: formattedUsername,
      displayname,
      password: hashedPassword,
      bgcolor,
    });
    res.render("login", {
      success: "Account successfully created. You can now log in.",
    });
  } else {
    res.status(400).render("register", {
      error: "Username already taken. Please choose another one.",
    });
  }
}

function getLoginForm(req, res) {
  const queryMessage = req?.query;
  if (req.user) {
    res.redirect("/home");
  } else {
    res.render("login", {
      error: queryMessage?.error,
      success: queryMessage?.success,
      warn: queryMessage?.warn,
    });
  }
}

function logout(req, res, next) {
  if (req.user) {
    req.logout((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect(
        `/auth/login?success=${encodeURI("Successfully logged out.")}`,
      );
    });
  } else {
    res.redirect(`/auth/register`);
  }
}

module.exports = {
  getRegisterForm,
  postRegisterForm: [validateRegInput, postRegisterForm],
  getLoginForm,
  logout,
};
