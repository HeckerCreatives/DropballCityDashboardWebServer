const Wallets = require("../models/Wallets"),
  TransactionHistory = require("../models/TransactionHistory"),
  GCGametoWebHistory = require("../models/CreditBalancehistory.js"),
  Users = require("../models/Users"),
  PlayerWinHistory = require("../models/Playerwinhistory");
  const { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } = require('date-fns');


exports.convert = async (req, res) => {
    const { username ,amount, type } = req.body

     const session = await Wallets.startSession();
      try {
        session.startTransaction();           
         const admin = await Users.find({username: username})       
          if (type === "commission") {
              await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { amount: +amount, commission: -amount}})
          } else if (type === "tong") {
              await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { amount: +amount, tong: -amount}})
          } else if (type === "credit") {
              await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { pot: +amount, amount: -amount}})
          } else if (type === "pot") {
            await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { pot: -amount}})
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
  const {amount, username } = req.body

  const session = await Wallets.startSession();
  try {
    session.startTransaction();
    const player = await Users.find({username: username.toLowerCase()})
    if(player){
      await Wallets.findOneAndUpdate({userId : player[0]._id}, {$inc: {amount: +amount}})
      const gcgametowebhistory = {
        user: username,
        usertransferAmount: amount,
      }
      await GCGametoWebHistory.create(gcgametowebhistory)
      res.json({ response: "success" })
    } else {
      res.json({ response: "fail" })
    }       
      
      await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    res.json(error);
  }
  session.endSession();
}

exports.convertpottogame = async (req, res) => {
  const { amount } = req.body

  const session = await Wallets.startSession();
  try {
    session.startTransaction();
    const admin = await Users.find({username: "dropballcityadmin"})
    if(admin){
      await Wallets.findOneAndUpdate({userId : admin[0]._id}, {$inc: {pot: -amount}})
      // const gcgametowebhistory = {
      //   user: username,
      //   usertransferAmount: amount,
      // }
      // await GCGametoWebHistory.create(gcgametowebhistory)
      res.json({ response: "success" })
    } else {
      res.json({ response: "fail" })
    }       
      
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
      adminUsername,
      winAmount,
      playfabId,
      game, // ipasa dito kung anung game yun? 
      round,
    } = req.body

      const users = await Users.find({ username: [ goldUsername, silverUsername, adminUsername ] })
      const goldDetails = users.filter((i) => i.username == goldUsername);    
      const silverDetails = users.filter((i) => i.username == silverUsername);  
      const adminDetails = users.filter((i) => i.username == adminUsername); 
      const player = await Users.find({playfabId: playfabId}).populate({path: "referrerId"})
      let g;
      let a;
      // let jackpotWalletPer;

      if(game === "dropball"){
       g = silverDetails.length !== 0 ? 20 : 60;
      //  a = goldDetails.length !== 0 ? 50 : 97;
      // jackpotWalletPer = (loseWallet / 100) * 3;
      a = 37;
      } else {
        g = silverDetails.length !== 0 ? 20 : 60;
        // a = goldDetails.length !== 0 ? 40 : 97;
        // jackpotWalletPer = 0;
        a = 40;
      }
      

      const silverPer = silverDetails.length !== 0 ? (loseWallet / 100) * 40 : 0;
      const goldPer = goldDetails.length !== 0 ? (loseWallet / 100) * g : 0;
      const adminPer = (loseWallet / 100) * a; 
      
      const commissionPer = adminPer;
      const win60 = winAmount * .60;
      const win40 = winAmount * .40;

      const transactionParams = {
        tongAmount: tongWallet,
        loseAmount: loseWallet,
        adminUsername: adminUsername,
        silverUsername: silverUsername,
        goldUsername: goldUsername,
        adminAmount: adminPer,
        goldAmount: goldPer,
        silverAmount: silverPer,
        playerUsername: player[0].username,
        // potAmount: jackpotWalletPer,
        commissionAmount: commissionPer,
        Game: game,
        Round: round,
      }

      const Winner60 = {
        Player: player[0].username,
        Agent: player[0].referrerId.username,
        WinAmount: win60,
        Game: game,
        Round: round, 
      }

      const Winner40 = {
        Player: player[0].username,
        Agent: adminUsername,
        WinAmount: win40,
        Game: game,
        Round: round,
      }

      const session = await Wallets.startSession();
      try {
        session.startTransaction();
          await Wallets.findOneAndUpdate({ userId: adminDetails[0]?._id}, { $inc: {  tong: +tongWallet, commission: commissionPer}})
          await Wallets.findOneAndUpdate({ userId: goldDetails[0]?._id}, { $inc: { commission: +goldPer } })
          await Wallets.findOneAndUpdate({ userId: silverDetails[0]?._id}, { $inc: { commission: +silverPer } })
          await TransactionHistory.create(transactionParams)

          await Wallets.findOneAndUpdate({userId: player[0]?.referrerId._id}, {$inc: {commission: -win60}})
          await Wallets.findOneAndUpdate({ userId: adminDetails[0]?._id}, { $inc: { commission: -win40}})

          await PlayerWinHistory.create(Winner60)
          await PlayerWinHistory.create(Winner40)

        res.json({message: "success"});
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

exports.gcgametoweb = (req, res) =>
  GCGametoWebHistory.find()
    .then(items => res.json(items))
    .catch(error => res.status(400).json({ error: error.message }));

exports.commissionhistory = async (req, res) => {
  const { agent } = req.body;

  let query;
  const user = await Users.find({username: agent}).populate({ path: "roleId" })

  if (user[0].roleId.name === "admin"){

    query = {adminUsername: agent, adminAmount: {$ne: 0}}

  } else if (user[0].roleId.name === "gold"){

    query = {goldUsername: agent, goldAmount: {$ne: 0}}

  } else if (user[0].roleId.name === "silver"){

    query = {silverUsername: agent, silverAmount: {$ne: 0}}

  }

  TransactionHistory.find(query)
  .then(items => res.json(items))
  .catch(error => res.status(400).json({ error: error.message }));
}

exports.totalcommissionhistory = async (req, res) => {
  const { agent } = req.body;

  try {
    const user = await Users.findOne({ username: agent }).populate("roleId");

    if (!user) {
      return res.status(404).json({ error: "Agent not found" });
    }

    let query;
    let amountField;
    
    if (user.roleId.name === "admin") {
      query = { adminUsername: agent, adminAmount: { $ne: 0 } };
      amountField = "adminAmount";
    } else if (user.roleId.name === "gold") {
      query = { goldUsername: agent, goldAmount: { $ne: 0 } };
      amountField = "goldAmount";
    } else if (user.roleId.name === "silver") {
      query = { silverUsername: agent, silverAmount: { $ne: 0 } };
      amountField = "silverAmount";
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    TransactionHistory.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: `$${amountField}` }
        }
      }
    ])
    .then(result => {
      if (result.length === 0) {
        return res.json({ totalAmount: 0 });
      } else {
        return res.json(result[0]);
      }
    })
    .catch(error => res.status(500).json({ error: error.message }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

     

exports.playerwinhistory = (req, res) =>
    PlayerWinHistory.find()
      .then(items => res.json(items))
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
          amount: 0,
          commission: 0,
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
    }).then(user => {
      return user.filter(e => !e.deletedAt)
    })
    
    const users = userList;

    const ids = userList.map(e => e._id)
    const username = userList.map(e => e.username)
    const downline = await Users.find({referrerId: {$in : ids}})
    const status = await PlayerWinHistory.findOne({Player: {$in: username}})
    const walletPromises = users.map(async user => {
      const wallet = await Wallets.findOne({ userId: user._id });
      if (!wallet) {
        return Wallets.create({
          userId: user._id,
          amount: 0,
          commission: 0
        });
      }
      return wallet;
    });

    const collection = await Promise.all(walletPromises);
    
    res.json({ collection, users, downline, status });
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

// exports.deducthistory = (req, res) => {
//   const { agent } = req.body;
//   if(agent === "dropballcityadmin"){
//   PlayerWinHistory.find()
//   .then((data)=>{
//     res.json({message: "success", data: data})
//   })
//   .catch((error)=>{
//     res.status(400).json({message:"BadRequest", error: error.message})
//   })
//   } else {
//     PlayerWinHistory.find({Agent: agent})
//     .then((data)=>{
//       res.json({message: "success", data: data})
//     })
//     .catch((error)=>{
//       res.status(400).json({message:"BadRequest", error: error.message})
//     })
//   }
  
// }

exports.deducthistory = (req, res) => {
  const { agent } = req.body;
  const query = { WinAmount: { $ne: 0 } };

  if (agent !== "dropballcityadmin") {
    query.Agent = agent;
  }

  PlayerWinHistory.find(query)
    .then((data) => {
      res.json({ message: "success", data: data });
    })
    .catch((error) => {
      res.status(400).json({ message: "BadRequest", error: error.message });
    });
};

exports.totaldeducthistory = (req, res) => {
  const { agent } = req.body;
  const query = {Agent: agent};

  PlayerWinHistory.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: `$WinAmount` }
      }
    }
  ])
  .then(result => {
    if (result.length === 0) {
      return res.json({ totalAmount: 0 });
    } else {
      return res.json(result[0]);
    }
  })
    .catch((error) => {
      res.status(400).json({ message: "BadRequest", error: error.message });
    });
};


exports.totaldeductperday = async (req, res) => {
  const { agent } = req.body;

  const currentDate = new Date();
  const currentStartOfDay = startOfDay(currentDate);
  const currentEndOfDay = endOfDay(currentDate);

  
    const perDay = await PlayerWinHistory.aggregate([
      {
        $match: {
          Agent: agent,
          createdAt: {$gte: currentStartOfDay, $lte: currentEndOfDay}
        }
      },
      {
        $group: {
          _id: null,
          totaldeduction: {$sum: "$WinAmount"}
        }
      }
    ])

    res.json(perDay.length? perDay[0].totaldeduction: 0)
}

exports.totaldeductpermonth = async (req, res) => {
  const { agent } = req.body;

  const currentDate = new Date();
  const currentstartOfMonth = startOfMonth(currentDate);
  const currentendOfMonth = endOfMonth(currentDate);

  
    const perMonth = await PlayerWinHistory.aggregate([
      {
        $match: {
          Agent: agent,
          createdAt: {$gte: currentstartOfMonth, $lte: currentendOfMonth}
        }
      },
      {
        $group: {
          _id: null,
          totaldeduction: {$sum: "$WinAmount"}
        }
      }
    ])

    res.json(perMonth.length? perMonth[0].totaldeduction: 0)
}

exports.totaldeductperyear = async (req, res) => {
  const { agent } = req.body;

  const currentDate = new Date();
  const currentstartOfYear = startOfYear(currentDate);
  const currentendOfYear = endOfYear(currentDate);

  
    const perYear = await PlayerWinHistory.aggregate([
      {
        $match: {
          Agent: agent,
          createdAt: {$gte: currentstartOfYear, $lte: currentendOfYear}
        }
      },
      {
        $group: {
          _id: null,
          totaldeduction: {$sum: "$WinAmount"}
        }
      }
    ])

    res.json(perYear.length? perYear[0].totaldeduction: 0)
}

exports.totalcommissionperday = async (req, res) => {
  const { agent } = req.body;

  const currentDate = new Date();
  const currentStartOfDay = startOfDay(currentDate);
  const currentEndOfDay = endOfDay(currentDate);

  const user = await Users.find({username: agent}).populate({path: "roleId"})
  
  if(user[0].roleId.name === "admin"){
    const perDay = await TransactionHistory.aggregate([
      {
        $match: {
          adminUsername: agent,
          createdAt: {$gte: currentStartOfDay, $lte: currentEndOfDay}
        }
      },
      {
        $group: {
          _id: null,
          totalcommission: {$sum: "$adminAmount"}
        }
      }
    ])
    res.json(perDay.length? perDay[0].totalcommission: 0)
  } else if (user[0].roleId.name === "gold"){
    const perDay = await TransactionHistory.aggregate([
      {
        $match: {
          goldUsername: agent,
          createdAt: {$gte: currentStartOfDay, $lte: currentEndOfDay}
        }
      },
      {
        $group: {
          _id: null,
          totalcommission: {$sum: "$goldAmount"}
        }
      }
    ])
    res.json(perDay.length? perDay[0].totalcommission: 0)
  } else if (user[0].roleId.name === "silver"){
    const perDay = await TransactionHistory.aggregate([
      {
        $match: {
          silverUsername: agent,
          createdAt: {$gte: currentStartOfDay, $lte: currentEndOfDay}
        }
      },
      {
        $group: {
          _id: null,
          totalcommission: {$sum: "$silverAmount"}
        }
      }
    ])
    res.json(perDay.length? perDay[0].totalcommission: 0)
  }
}

exports.totalcommissionpermonth = async (req, res) => {
  const { agent } = req.body;

  const currentDate = new Date();
  const currentstartOfMonth = startOfMonth(currentDate);
  const currentendOfMonth = endOfMonth(currentDate);
  const user = await Users.find({username: agent}).populate({path: "roleId"})
  
  if(user[0].roleId.name === "admin"){
    const perMonth = await TransactionHistory.aggregate([
      {
        $match: {
          adminUsername: agent,
          createdAt: {$gte: currentstartOfMonth, $lte: currentendOfMonth}
        }
      },
      {
        $group: {
          _id: null,
          totalcommission: {$sum: "$adminAmount"}
        }
      }
    ])
    res.json(perMonth.length? perMonth[0].totalcommission: 0)
  } else if (user[0].roleId.name === "gold"){
    const perMonth = await TransactionHistory.aggregate([
      {
        $match: {
          goldUsername: agent,
          createdAt: {$gte: currentstartOfMonth, $lte: currentendOfMonth}
        }
      },
      {
        $group: {
          _id: null,
          totalcommission: {$sum: "$goldAmount"}
        }
      }
    ])
    res.json(perMonth.length? perMonth[0].totalcommission: 0)
  } else if (user[0].roleId.name === "silver"){
    const perMonth = await TransactionHistory.aggregate([
      {
        $match: {
          silverUsername: agent,
          createdAt: {$gte: currentstartOfMonth, $lte: currentendOfMonth}
        }
      },
      {
        $group: {
          _id: null,
          totalcommission: {$sum: "$silverAmount"}
        }
      }
    ])
    res.json(perMonth.length? perMonth[0].totalcommission: 0)
  }
    

    
}

exports.totalcommissionperyear = async (req, res) => {
  const { agent } = req.body;

  const currentDate = new Date();
  const currentstartOfYear = startOfYear(currentDate);
  const currentendOfYear = endOfYear(currentDate);

  const user = await Users.find({username: agent}).populate({path: "roleId"})
  
  if(user[0].roleId.name === "admin"){
    const perYear = await TransactionHistory.aggregate([
      {
        $match: {
          adminUsername: agent,
          createdAt: {$gte: currentstartOfYear, $lte: currentendOfYear}
        }
      },
      {
        $group: {
          _id: null,
          totalcommission: {$sum: "$adminAmount"}
        }
      }
    ])
    res.json(perYear.length? perYear[0].totalcommission: 0)
  } else if (user[0].roleId.name === "gold"){
    const perYear = await TransactionHistory.aggregate([
      {
        $match: {
          goldUsername: agent,
          createdAt: {$gte: currentstartOfYear, $lte: currentendOfYear}
        }
      },
      {
        $group: {
          _id: null,
          totalcommission: {$sum: "$goldAmount"}
        }
      }
    ])
    res.json(perYear.length? perYear[0].totalcommission: 0)
  } else if (user[0].roleId.name === "silver"){
    const perYear = await TransactionHistory.aggregate([
      {
        $match: {
          silverUsername: agent,
          createdAt: {$gte: currentstartOfYear, $lte: currentendOfYear}
        }
      },
      {
        $group: {
          _id: null,
          totalcommission: {$sum: "$silverAmount"}
        }
      }
    ])
    res.json(perYear.length? perYear[0].totalcommission: 0)
  }
}

exports.plusfive = async  (req, res) => {
  const {username} = req.body

  const session = await Wallets.startSession();
  try {
    session.startTransaction();
    const admin = await Users.find({username: "dropballcityadmin"})
    const player = await Users.find({username: username.toLowerCase()})
    if(player){
      await Wallets.findOneAndUpdate({userId : player[0]._id}, {$inc: {amount: 5}})
      await Wallets.findOneAndUpdate({userId : admin[0]._id}, {$inc: {amount: -5}})
      res.json({ response: "success" })
    } else {
      res.json({ response: "fail" })
    }       
      
      await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    res.json(error);
  }
  session.endSession();
}