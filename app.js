const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const homeRouter = require("./routes/homeRouter");
const authRouter = require("./routes/authRouter");
const roleRouter = require("./routes/roleRouter");
const postRouter = require("./routes/postRouter");
const pgStore = require("connect-pg-simple")(session);

require("dotenv").config();

// express init
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set views folder for ejs templates

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set public folder for static files

app.use(express.static("public"));

// Session Setup

app.use(
  session({
    store: new pgStore({
      conString: process.argv[2] || process.env.DB_URL,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

// Passport Auth
app.use(passport.session());

// Routers
app.use(homeRouter);
app.use(authRouter);
app.use(roleRouter);
app.use(postRouter);

// app Listener
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
