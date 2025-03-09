const db = require("../db/queries");
async function assignNewRole(req, res) {
  let { secretcode } = req.body;
  const { username } = req.user;

  if (req.user.role === "member") {
    if (typeof secretcode === typeof "string") {
      secretcode = secretcode.toLowerCase();
      await db.assignRole(username, secretcode);
    }
    res.redirect("/");
  } else if (req.user.role === "jerk-member") {
    res.redirect(
      `/home?errorFloat=${encodeURI(
        "HAHAHAHA, SHIT ASS! YOUR ROLE WILL NEVER CHANGE.",
      )}`,
    );
  }
}

async function assignJerkMember(req, res) {
  const { username, role } = req.user;
  if (role === "member") {
    await db.assignDirectRole(username, "jerk-member");
    res.redirect("/");
  } else {
    res.redirect(`/home?errorFloat=${encodeURI("What are you trying to do?")}`);
  }
}

module.exports = {
  assignNewRole,
  assignJerkMember,
};
