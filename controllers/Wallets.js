const Wallets = require("../models/Wallets"),
  TransactionHistory = require("../models/TransactionHistory"),
  Users = require("../models/Users");



exports.convert = async (req, res) => {
    const { amount, type } = req.body

     const session = await Wallets.startSession();
      try {
        session.startTransaction();           
         const admin = await Users.find({username: "Admin"})       
          if (type === "commission") {
              await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { initial: +amount, commission: -amount}})
          } else if (type === "tong") {
              await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { initial: +amount, tong: -amount}})
          } else if (type === "credit") {
              await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { initial: +amount, amount: -amount}})
          }

         res.json({ response: "success" })
        await session.commitTransaction();
      } catch (error) {
          await session.abortTransaction();
          res.json(error);
      }
      session.endSession();
}

exports.convertgctoweb = async (req, res) => {
  const {amount, email } = req.body


  const session = await Wallets.startSession();
  try {
    session.startTransaction();
    const player = await Users.find({$or: [{email}, {username: email}]})
    if(player){
      await Wallets.findOneAndUpdate({userId : player[0]._id}, {$inc: {amount: +amount}})
    }    
      res.json({ response: "success" })
      await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    res.json(error);
  }
  session.endSession();
}

exports.loseTransfer = async (req, res) => {
    const { 
      tongWallet, 
      loseWallet, 
      goldUsername, 
      silverUsername, 
      adminUsername 
    } = req.body

      const users = await Users.find({ username: [ goldUsername, silverUsername, adminUsername ] })
      const goldDetails = users.filter((i) => i.username == goldUsername);    
      const silverDetails = users.filter((i) => i.username == silverUsername);  
      const adminDetails = users.filter((i) => i.username == adminUsername); 

      const g = silverDetails.length !== 0 ? 25 : 47;
      const a = goldDetails.length !== 0 ? 50 : 97;

      const silverPer = silverDetails.length !== 0 ? (loseWallet / 100) * 22 : 0;
      const goldPer = goldDetails.length !== 0 ? (loseWallet / 100) * g : 0;
      const adminPer = (loseWallet / 100) * a; 
      const jackpotWalletPer = (loseWallet / 100) * 3;
      const commissionPer = silverPer + goldPer + adminPer;

      const transactionParams = {
        tongAmount: tongWallet,
        loseAmount: loseWallet,
        adminUsername: adminUsername,
        silverUsername: silverUsername,
        goldUsername: goldUsername,
        adminAmount: adminPer,
        goldAmount: goldPer,
        silverAmount: silverPer,
        potAmount: jackpotWalletPer,
        commissionAmount: commissionPer
      }

      const session = await Wallets.startSession();
      try {
        session.startTransaction();                  
          await Wallets.findOneAndUpdate({ userId: adminDetails[0]?._id}, { $inc: { amount: +adminPer, tong: +tongWallet, pot: +jackpotWalletPer, commission: commissionPer}})
          await Wallets.findOneAndUpdate({ userId: goldDetails[0]?._id}, { $inc: { amount: +goldPer } })
          await Wallets.findOneAndUpdate({ userId: silverDetails[0]?._id}, { $inc: { amount: +silverPer } })
          await TransactionHistory.create(transactionParams)

        res.json([silverPer, goldPer, adminPer, jackpotWalletPer, commissionPer]);
        await session.commitTransaction();
      } catch (error) {
          await session.abortTransaction();
          res.json(error);
      }
      session.endSession();

}

// entity/
exports.browse = (req, res) =>
  Wallets.find()
    .populate({
      path: "userId",
      select: "referrerId username",
    })
    .then(items => res.json(items.filter(item => !item.deletedAt)))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/
// module.exports.browse = (req, res) =>
//   Wallets.find()
//     .populate({
//       path: "userId",
//       select: "referrerId username",
//     })
//     .then(items => res.json(items.filter(item => !item.deletedAt)))
//     .catch(error => res.status(400).json({ error: error.message }));

// entity/
// exports.everything = (req, res) =>
//     Users.find()
//     .select("-password")
//     .populate({
//       path: "roleId",
//       select: "display_name name",
//     })
//     .then(async list => {
//       const noadmin = list.filter(u => u.roleId.name !== "admin");
//       const users = noadmin.filter(u => !u.deletedAt);
//       var collection = [];

//       for (let index = 0; index < users.length; index++) {
//         const checker = await Wallets.findOne({
//           userId: users[index]._id,
//         });
//         if (checker) {
//           collection.push(checker);
//         } else {
//           const create = await Wallets.create({
//             userId: users[index]._id,
//             amount: 0,
//           });
//           if (create) {
//             collection.push(create);
//           }
//         }
//       }

//       res.json({ collection, users });
//     })
//     .catch(error => res.status(400).json({ error: error.message }));

// entity/
exports.everything = async (req, res) => {
  try {
    const userList = await Users.find().select("-password").populate({
      path: "roleId",
      select: "display_name name"
    });

    const users = userList.filter(user => user.roleId.name !== "admin" && !user.deletedAt);
    
    const walletPromises = users.map(async user => {
      const wallet = await Wallets.findOne({ userId: user._id });
      if (!wallet) {
        return Wallets.create({
          userId: user._id,
          amount: 0
        });
      }
      return wallet;
    });

    const collection = await Promise.all(walletPromises);
    
    res.json({ collection, users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// entity/
// exports.referrals = (req, res) =>
//   Users.find()
//     .byRefferal(req.params.userId)
//     .select("-password")
//     .populate({
//       path: "roleId",
//       select: "display_name name",
//     })
//     .then(async users => {
//       var collection = [];

//       for (let index = 0; index < users.length; index++) {
//         const checker = await Wallets.findOne({
//           userId: users[index]._id,
//         });
//         if (checker) {
//           collection.push(checker);
//         } else {
//           const create = await Wallets.create({
//             userId: users[index]._id,
//             amount: 0,
//           });
//           if (create) {
//             collection.push(create);
//           }
//         }
//       }

//       res.json({ collection, users });
//     })
//     .catch(error => res.status(400).json({ error: error.message }));

// entity/
exports.referrals = async (req, res) => {
  try {
    const userList = await Users.find().byRefferal(req.params.userId).populate({
      path: "roleId",
      select: "display_name name"
    });
    
    const users = userList;

    const walletPromises = users.map(async user => {
      const wallet = await Wallets.findOne({ userId: user._id });
      if (!wallet) {
        return Wallets.create({
          userId: user._id,
          amount: 0
        });
      }
      return wallet;
    });

    const collection = await Promise.all(walletPromises);
    
    res.json({ collection, users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// entity/:userId/find
exports.find = (req, res) =>
  Wallets.findOne({ userId: req.params.userId })
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/save
exports.save = (req, res) =>
  Wallets.create(req.body)
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/update
exports.update = (req, res) =>
  Wallets.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/destroy
exports.destroy = (req, res) =>
  Wallets.findByIdAndUpdate(req.params.id, {
    deletedAt: new Date().toLocaleString(),
  })
    .then(() => res.json(req.params.id))
    .catch(error => res.status(400).json({ error: error.message }));
