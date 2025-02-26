const db = require("../db/queries");
async function assignNewRole(req,res) {
    let {secretcode} = req.body;
    const {username} = req.user

   if (req.user.role === "member") {
    if(typeof secretcode === typeof 'string' ) {
        secretcode = secretcode.toLowerCase()
        await db.assignRole(username,secretcode);

        
    }
   }
    res.redirect('/')
}

async function assignJerkMember(req,res) {
    const {username, role} = req.user
    if(role === 'member' ) {
        await db.assignDirectRole(username, 'jerk-member');
    }
    res.redirect('/')
}

module.exports = {
    assignNewRole,
    assignJerkMember
}