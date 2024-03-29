const Wallets = require("../models/Wallets"),
  TransactionHistory = require("../models/TransactionHistory"),
  GCGametoWebHistory = require("../models/CreditBalancehistory.js"),
  Users = require("../models/Users"),
  CommiOnOff = require("../models/Commionoff"),
  PlayerWinHistory = require("../models/Playerwinhistory");
  const { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } = require('date-fns');

exports.updatecommionoff = (req, res) => {
  const { stats } = req.body

  CommiOnOff.findOneAndUpdate({_id: "629a98a5a881575c013b5340"}, {status: stats})
  .then(data => {
    if(data){
      res.json({message: "success"})
    } else {
      res.json({message: "failed"})
    }
  })
  .catch(error => res.status(400).json({ error: error.message }));
}

exports.findcommionoff = (req, res) => {

  CommiOnOff.findOne({_id: "629a98a5a881575c013b5340"})
  .then(data => {
    if(data){
      res.json({message: "success", data: data})
    } else {
      res.json({message: "failed"})
    }
  })
  .catch(error => res.status(400).json({ error: error.message }));
}

exports.convert = async (req, res) => {
    const { username ,amount, type } = req.body

     const session = await Wallets.startSession();
      try {
        session.startTransaction();           
         const admin = await Users.find({username: username})    
         const stats = await CommiOnOff.findOne({})
        .then(data => {
          return data.status
        })
        .catch(error => res.status(400).json({ error: error.message }));  

        // if(stats === "Off"){
        //   await session.abortTransaction();
        //   return res.status(400).json({message: "failed", data: "Commission cannot convert now contact admins for the schedule of commission conversion"})
        // } 

          if (type === "commission" && stats === "On") {
            await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { amount: +amount, commission: -amount}})
              
          } else if (type === "tong") {
              await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { amount: +amount, tong: -amount}})
          } else if (type === "credit") {
              await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { pot: +amount, amount: -amount}})
          } else if (type === "pot") {
            await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { pot: -amount}})
          } else if (type === "agentpools") {
            await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { agentpools: amount, amount: -amount}})
          } else if (type === "resetagentpools") {
            await Wallets.findOneAndUpdate({ userId: admin[0]._id}, { $inc: { agentpools: -amount, amount: amount}})
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
      const win20 = winAmount * .20;

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

      let Winner20
      let Winner40
      let Winner60
      
      if(silverDetails.length !== 0){
        Winner60 = {
          Player: player[0].username,
          Agent:  silverDetails[0]?.username,
          WinAmount: win40,
          Game: game,
          Round: round, 
        }
  
        Winner40 = {
          Player: player[0].username,
          Agent: adminUsername,
          WinAmount: win40,
          Game: game,
          Round: round,
        }

        Winner20 = {
          Player: player[0].username,
          Agent: goldDetails[0]?.username,
          WinAmount: win20,
          Game: game,
          Round: round,
        }

      } else {
        Winner60 = {
          Player: player[0].username,
          Agent: goldDetails[0]?.username,
          WinAmount: win60,
          Game: game,
          Round: round, 
        }
  
        Winner40 = {
          Player: player[0].username,
          Agent: adminUsername,
          WinAmount: win40,
          Game: game,
          Round: round,
        }
      }

      const session = await Wallets.startSession();
      try {
        session.startTransaction();
          await Wallets.findOneAndUpdate({ userId: adminDetails[0]?._id}, { $inc: {  tong: +tongWallet, commission: commissionPer}})
          await Wallets.findOneAndUpdate({ userId: goldDetails[0]?._id}, { $inc: { commission: +goldPer } })
          await Wallets.findOneAndUpdate({ userId: silverDetails[0]?._id}, { $inc: { commission: +silverPer } })
          await TransactionHistory.create(transactionParams)

          if(silverDetails.length !== 0){
            await Wallets.findOneAndUpdate({userId: goldDetails[0]?._id}, {$inc: {commission: -win20}})
            await Wallets.findOneAndUpdate({userId: silverDetails[0]?._id}, {$inc: {commission: -win40}}) //for history porpose winner60
            await Wallets.findOneAndUpdate({ userId: adminDetails[0]?._id}, { $inc: { commission: -win40}})
            await PlayerWinHistory.create(Winner20)
            await PlayerWinHistory.create(Winner60)
            await PlayerWinHistory.create(Winner40)
            
          } else {
            await Wallets.findOneAndUpdate({userId: goldDetails[0]?._id}, {$inc: {commission: -win60}})
            await Wallets.findOneAndUpdate({ userId: adminDetails[0]?._id}, { $inc: { commission: -win40}})
            await PlayerWinHistory.create(Winner60)
            await PlayerWinHistory.create(Winner40)
          }

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
        return res.json(result[0]?.totalAmount);
      } else {

        PlayerWinHistory.aggregate([
          {
            $match: {
              Agent: agent
            }
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: `$WinAmount` }
            }
          }
        ])
        .then(result1 => {
          if (result1.length === 0) {
            const data = result[0]?.totalAmount - result1[0]?.totalAmount
            return res.json(data);
          } else {
            const data = result[0]?.totalAmount - result1[0]?.totalAmount
            return res.json(data);
          }
        })
        .catch((error) => {
          res.status(400).json({ message: "BadRequest", error: error.message });
        });
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
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const users = userList;

    const ids = userList.map(e => e._id)
    const username = userList.map(e => e.username)
    const downline = await Users.find({referrerId: {$in : ids}})
    const agent = await Users.findOne({_id: req.params.userId})
    const status = await PlayerWinHistory.aggregate([
      {
        $match: {
          Player: { $in: username },
          Agent: agent.username,
          createdAt: { $gte: oneMonthAgo} // You can adjust this based on your time criteria
        }
      },
      {
        $sort: { createdAt: -1 } // Sort by createdAt in descending order
      },
      {
        $group: {
          _id: "$Player",
          latestRecord: { $first: "$$ROOT" } // Get the first document for each player (latest record)
        }
      },
      {
        $replaceRoot: { newRoot: "$latestRecord" } // Replace the root with the latest record for each player
      }
    ]);

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

    const deductperDay = await PlayerWinHistory.aggregate([
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
    
    if(perDay[0]?.totalcommission !== undefined && deductperDay[0]?.totaldeduction !== undefined){
      const data = perDay[0]?.totalcommission - deductperDay[0]?.totaldeduction
      console.log(data)
      console.log(perDay[0]?.totalcommission)
      console.log(deductperDay[0]?.totaldeduction)
      res.json(perDay.length? data: 0)
    } else {
      res.json(0)
    }
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

    const deductperDay = await PlayerWinHistory.aggregate([
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
    if(perDay[0]?.totalcommission !== undefined && deductperDay[0]?.totaldeduction !== undefined){
      const data = perDay[0]?.totalcommission - deductperDay[0]?.totaldeduction
      console.log(data)
      console.log(perDay[0]?.totalcommission)
      console.log(deductperDay[0]?.totaldeduction)
      res.json(perDay.length? data: 0)
    } else {
      res.json(0)
    }
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
    
    const deductperDay = await PlayerWinHistory.aggregate([
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

    if(perDay[0]?.totalcommission !== undefined && deductperDay[0]?.totaldeduction !== undefined){
      const data = perDay[0]?.totalcommission - deductperDay[0]?.totaldeduction
      console.log(data)
      console.log(perDay[0]?.totalcommission)
      console.log(deductperDay[0]?.totaldeduction)
      res.json(perDay.length? data: 0)
    } else {
      res.json(0)
    }
    
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

    const deductperMonth = await PlayerWinHistory.aggregate([
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
    if(perMonth[0]?.totalcommission !== undefined && deductperMonth[0]?.totaldeduction !== undefined){
      const data = perMonth[0]?.totalcommission - deductperMonth[0]?.totaldeduction
      res.json(perMonth.length ? data: 0)
    } else {
      res.json(0)
    }
    
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
    
    const deductperMonth = await PlayerWinHistory.aggregate([
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

    if(perMonth[0]?.totalcommission !== undefined && deductperMonth[0]?.totaldeduction !== undefined){
      const data = perMonth[0]?.totalcommission - deductperMonth[0]?.totaldeduction
      res.json(perMonth.length ? data: 0)
    } else {
      res.json(0)
    }
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
    
    const deductperMonth = await PlayerWinHistory.aggregate([
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

    if(perMonth[0]?.totalcommission !== undefined && deductperMonth[0]?.totaldeduction !== undefined){
      const data = perMonth[0]?.totalcommission - deductperMonth[0]?.totaldeduction
      res.json(perMonth.length ? data: 0)
    } else {
      res.json(0)
    }
  }
    

    
}

exports.totalcommissionperyear = async (req, res) => {
  const { agent } = req.body;

  const currentDate = new Date();
  const currentstartOfYear = startOfYear(currentDate);
  const currentendOfYear = endOfYear(currentDate);

  const user = await Users.find({username: agent}).populate({path: "roleId"})
  const wallet = await Wallets.findOne({userId: user[0]._id})
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

    const deductperYear = await PlayerWinHistory.aggregate([
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
    if(perYear[0]?.totalcommission !== undefined && deductperYear[0]?.totaldeduction !== undefined){
      const data = perYear[0]?.totalcommission - deductperYear[0]?.totaldeduction
      res.json(perYear.length? data: 0)
    } else {
      res.json(0)
    }
    
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

    const deductperYear = await PlayerWinHistory.aggregate([
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

    if(perYear[0]?.totalcommission !== undefined && deductperYear[0]?.totaldeduction !== undefined){
      const data = perYear[0]?.totalcommission - deductperYear[0]?.totaldeduction
      res.json(perYear.length? data: 0)
    } else {
      res.json(0)
    }
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
    
    const deductperYear = await PlayerWinHistory.aggregate([
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

    if(perYear[0]?.totalcommission !== undefined && deductperYear[0]?.totaldeduction !== undefined){
      const data = perYear[0]?.totalcommission - deductperYear[0]?.totaldeduction
      res.json(perYear.length? data: 0)
    } else {
      res.json(0)
    }
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

exports.topagents = async (req, res) => {
  Wallets.find({ _id: { $ne: "6450930b69622f8f6382d3a7" } })
  .populate({
    path: "userId"
  })
  .sort({"commission": -1})
  .limit(15)
  .then(data => {
    const namber = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    const persent = [25,20,15,10,8,5,4,3,2,2,2,1,1,1,1]
    const finaldata = {
      "rank": namber,
      "agents": data,
      "percentage": persent
    }
    res.json({message: "success", data: finaldata})
  })
  .catch(error => res.status(400).json({ error: error.message }));
}