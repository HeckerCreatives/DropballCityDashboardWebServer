const User = require("../models/Users");
const Role = require("../models/Roles");

// entity/
exports.browse = (req, res) =>
  User.find()
    .select("-password")
    .populate({
      path: "roleId",
      select: "display_name name",
    })
    .then(users => res.json(users))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:userId/referral
exports.referral = (req, res) =>
  User.find()
    .byRefferal(req.params.userId)
    .select("-password")
    .populate({
      path: "roleId",
      select: "display_name name",
    })
    .then(users => res.json(users.filter(user => !user.deletedAt)))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/find
exports.getParentReferrer = (req, res) =>
  User.findById(req.params.id)
    .select("-password")
    .populate({
      path: "roleId",
      select: "name",
    })
    .populate({
        path : 'referrerId',
        select: "roleId referrerId username",
          populate:
          [
            {
                path: 'referrerId',
                select: "roleId referrerId username",
                model: User,
                  populate:
                   [
                      {
                        path: 'referrerId',
                        select: "roleId referrerId username",
                        model: User,
                          populate: {
                              path: "roleId",
                              select: "name",
                          }
                      }, 
                      {
                        path: 'roleId',
                        select: "name",
                        model: Role
                      }
                   ]
            },
            {
                path: 'roleId',
                select: "name",
                model: Role
            }
        ],
    })
    .then(user => {
        let data = {};
        switch (user.roleId.name) {
          // case "player":
          //   if (user.referrerId.roleId?.name === "silver") {
          //        data = {
          //         "silver": user?.username,
          //         "gold": user.referrerId?.username,
          //         "admin": user.referrerId.referrerId?.username,
          //       }
          //     } else {
          //       data = {
          //         "silver": "none",
          //         "gold": user?.username,
          //         "admin": user?.referrerId?.username,
          //       }
          //     }
          //   break;
          case "silver":
              data = {
                  "silver": user?.username,
                  "gold": user?.referrerId?.username,
                  "admin": user?.referrerId.referrerId?.username,
                }
              break;
          case "gold":
              data = {
                  "silver": "none",
                  "gold": user?.username,
                  "admin": user?.referrerId?.username,
                }
              break;
            default:
            data = {
                "silver": "none",
                "gold": "none",
                "admin": user?.username,
            }
        }

        res.json(data)
    })
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/find
exports.find = (req, res) =>
  User.findById(req.params.id)
    .select("-password")
    .populate({
      path: "roleId",
      select: "display_name name",
    })
    .then(user => res.json(user.deletedAt ? "User is banned!" : user))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/update
exports.update = (req, res) =>
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .select("-password")
    .populate({
      path: "roleId",
      select: "display_name name",
    })
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/destroy
exports.destroy = (req, res) =>
  User.findByIdAndUpdate(req.params.id, {
    deletedAt: new Date().toLocaleString(),
  })
    .then(() => res.json(`${req.params.id} deleted successfully`))
    .catch(error => res.status(400).json({ error: error.message }));


module.exports.migratetolowercase = (req, res) => {
  User.updateMany(
    {},
    [
      { 
        $set: { 
          email: { $toLower: "$email" }, 
          username: { $toLower: "$username" } 
        } 
      }
    ]
  )
    .then(() => {
      console.log("Records updated successfully.");
      // Continue with other operations or close the database connection
      res.json({ message: "Records updated successfully." });
    })
    .catch(error => {
      console.error("Error updating records:", error);
      // Handle the error
      res.status(500).json({ error: "An error occurred while updating records." });
    });
};

exports.emailcheck = (req, res) => {
  const {email} = req.body
  User.find({email: email})    
    .then(users => {
      if(users.length > 0){
        res.json(`user found`)
      } else {
        res.json(`user not found`)
      }
    })
    .catch(error => res.status(400).json({ error: error.message }));
}

exports.goldbanusers = (req, res) => {
  const gold = req.body.gold;

  User.findOne({username: gold})
  .populate({path: 'roleId'})
  .then(user =>{
    if(!user.roleId.name === 'gold'){
      res.json({message: "fail", data: 'you are not a gold agent'})
    } else {
      User.find({referrerId: user._id})
      .then(user => {
        res.json({message: 'success', data: user.filter(e => e.deletedAt)})
      })
      .catch(err => res.json({message:"BadRequest", data:err.message}))
    }
  })
  .catch(err => res.json({message:"BadRequest", data:err.message}))
}

exports.goldbanagent = (req, res) => {
  const gold = req.body.gold;

  User.findOne({username: gold})
  .populate({path: 'roleId'})
  .then(user =>{
    if(!user.roleId.name === 'gold'){
      res.json({message: "fail", data: 'you are not a gold agent'})
    } else {
      User.find({referrerId: user._id})
      .populate({path: 'roleId'})
      .then(user => {
        res.json({message: 'success', data: user.filter(e => e.deletedAt && e.roleId.name === "silver")})
      })
      .catch(err => res.json({message:"BadRequest", data:err.message}))
    }
  })
  .catch(err => res.json({message:"BadRequest", data:err.message}))
}

exports.silverbanusers = (req, res) => {
  const silver = req.body.silver;

  User.findOne({username: silver})
  .populate({path: 'roleId'})
  .then(user =>{
    if(!user.roleId.name === 'silver'){
      res.json({message: "fail", data: 'you are not a silver agent'})
    } else {
      User.find({referrerId: user._id, deletedAt: {$exists: true}})
      .then(user => {
        res.json({message: 'success', data: user})
      })
      .catch(err => res.json({message:"BadRequest", data:err.message}))
    }
  })
  .catch(err => res.json({message:"BadRequest", data:err.message}))
}