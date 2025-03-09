const { roleDetails } = require("../utils/userProfile");
const db = require("../db/queries");

async function getUserList(req, res) {
  let userList = await db.getAllUsers();
  userList = userList.map((item) => {
    return { ...item, ...roleDetails[item.role] };
  });
  res.render("userList", {
    user: { ...req.user, ...roleDetails[req.user.role] },
    roleDetails,
    userList,
    totalUsers: userList.length,
  });
}

module.exports = {
  getUserList,
};
