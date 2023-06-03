const Credit = require("../models/Credits"),
    Wallets = require("../models/Wallets"),
    Users = require("../models/Users");

exports.send = async (req, res) => {
    const { username, silverusername , goldusername, amount } = req.body
    const session = await Credit.startSession();
    try { 
      session.startTransaction();                  
      const users = await Users.find({ username: [ goldusername, username, silverusername ] })
      const goldDetails = users.filter((i) => i.username == goldusername)
      .populate({
        path: "roleId",
        select: "name",
      })    
      const silverDetails = users.filter((i) => i.username == silverusername)
      .populate({
        path: "roleId",
        select: "name",
      })    
      const userDetails = users.filter((i) => i.username == username)  
      const goldWallet = await Wallets.find({ "userId": goldDetails[0]?._id })
      const silverWallet = await Wallets.find({ "userId": silverDetails[0]?._id })
  
        if (userDetails.length !== 0 && goldDetails.roleId.name === "gold") {
          if (goldWallet[0].amount > amount) {
              await Credit.create(req.body);
              await Wallets.findOneAndUpdate({ userId: goldDetails[0]._id}, { $inc: { amount: -amount } });
              await Wallets.findOneAndUpdate({ userId: userDetails[0]._id }, { $inc: { amount: +amount } });
  
            await session.commitTransaction();
            res.json({ response: "success" })
          } else {
             await  session.abortTransaction();
             res.json({ response: "failed" })
          }
        } else if (userDetails.length !== 0 && silverDetails.roleId.name === "silver") {
            if (silverWallet[0].amount > amount) {
                await Credit.create(req.body);
                await Wallets.findOneAndUpdate({ userId: silverDetails[0]._id}, { $inc: { amount: -amount } });
                await Wallets.findOneAndUpdate({ userId: userDetails[0]._id }, { $inc: { amount: +amount } });
    
              await session.commitTransaction();
              res.json({ response: "success" })
            } else {
               await  session.abortTransaction();
               res.json({ response: "failed" })
            }
        } else {
          await  session.abortTransaction();
          res.json({ response: "user does not exist" })
        }
    
    } catch (error) {
        await  session.abortTransaction();
        res.json(error)
    } 
     session.endSession();
}

exports.claim = async (req, res) => {
    const { username, silverusername , goldusername, amount } = req.body
    const session = await Credit.startSession();
    try { 
      session.startTransaction();                  
      const users = await Users.find({ username: [ goldusername, username, silverusername ] })
      const goldDetails = users.filter((i) => i.username == goldusername)
      .populate({
        path: "roleId",
        select: "name",
      })    
      const silverDetails = users.filter((i) => i.username == silverusername)
      .populate({
        path: "roleId",
        select: "name",
      })    
      const userDetails = users.filter((i) => i.username == username)  
      const goldWallet = await Wallets.find({ "userId": goldDetails[0]?._id })
      const silverWallet = await Wallets.find({ "userId": silverDetails[0]?._id })
  
        if (userDetails.length !== 0 && goldDetails.roleId.name === "gold") {
          if (goldWallet[0].amount > amount) {
              await Credit.create(req.body);
              await Wallets.findOneAndUpdate({ userId: goldDetails[0]._id}, { $inc: { amount: +amount } });
              await Wallets.findOneAndUpdate({ userId: userDetails[0]._id }, { $inc: { amount: -amount } });
  
            await session.commitTransaction();
            res.json({ response: "success" })
          } else {
             await  session.abortTransaction();
             res.json({ response: "failed" })
          }
        } else if (userDetails.length !== 0 && silverDetails.roleId.name === "silver") {
            if (silverWallet[0].amount > amount) {
                await Credit.create(req.body);
                await Wallets.findOneAndUpdate({ userId: silverDetails[0]._id}, { $inc: { amount: +amount } });
                await Wallets.findOneAndUpdate({ userId: userDetails[0]._id }, { $inc: { amount: -amount } });
    
              await session.commitTransaction();
              res.json({ response: "success" })
            } else {
               await  session.abortTransaction();
               res.json({ response: "failed" })
            }
        } else {
          await  session.abortTransaction();
          res.json({ response: "user does not exist" })
        }
    
    } catch (error) {
        await  session.abortTransaction();
        res.json(error)
    } 
     session.endSession();
}