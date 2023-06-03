const Credit = require("../models/Credits"),
    Wallets = require("../models/Wallets"),
    Users = require("../models/Users");

exports.send = async (req, res) => {
    const { username, agentusername, amount } = req.body
    const session = await Credit.startSession();
    try { 
      session.startTransaction();                  
    
       const agentDetails = await Users.findOne({ username: agentusername })
       .populate({
       path: "roleId",
       select: "name",
       });
      
      const userDetails = await Users.findOne({ username: username })
      const agentWallet = await Wallets.find({ "userId": agentDetails._id })
        if (agentDetails.roleId.name === "gold") {
            console.log("waw")
          if (userDetails.length !== 0) {
            console.log("wew")
            if (agentWallet.amount > amount) {
                console.log("wrw")
                await Credit.create(req.body);
                await Wallets.findOneAndUpdate({ userId: agentDetails._id}, { $inc: { amount: -amount } });
                await Wallets.findOneAndUpdate({ userId: userDetails._id }, { $inc: { amount: +amount } });
    
              await session.commitTransaction();
              res.json({ response: "success" })
            } else {
               await  session.abortTransaction();
               res.json({ response: "failed" })
            }
          }
          
        } else if (agentDetails.roleId.name === "silver") {
            if (userDetails.length !== 0) {
                if (agentWallet.amount > amount) {
                    await Credit.create(req.body);
                    await Wallets.findOneAndUpdate({ userId: agentDetails._id}, { $inc: { amount: -amount } });
                    await Wallets.findOneAndUpdate({ userId: userDetails._id }, { $inc: { amount: +amount } });
        
                  await session.commitTransaction();
                  res.json({ response: "success" })
                } else {
                   await  session.abortTransaction();
                   res.json({ response: "failed" })
                }
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
    const { username, agentusername, amount } = req.body
    const session = await Credit.startSession();
    try { 
      session.startTransaction();                  
      const users = await Users.find({ username: [ agentusername, username ] })
      const agentDetails = users.filter((i) => i.username == agentusername)
      .populate({
        path: "roleId",
        select: "name",
      })    
      const userDetails = users.filter((i) => i.username == username)  
      const agentWallet = await Wallets.find({ "userId": agentDetails[0]?._id })
  
        if (userDetails.length !== 0 && agentDetails.roleId.name === "gold") {
          if (agentWallet[0].amount > amount) {
              await Credit.create(req.body);
              await Wallets.findOneAndUpdate({ userId: agentDetails[0]._id}, { $inc: { amount: +amount } });
              await Wallets.findOneAndUpdate({ userId: userDetails[0]._id }, { $inc: { amount: -amount } });
  
            await session.commitTransaction();
            res.json({ response: "success" })
          } else {
             await  session.abortTransaction();
             res.json({ response: "failed" })
          }
        } else if (userDetails.length !== 0 && agentDetails.roleId.name === "silver") {
            if (agentWallet[0].amount > amount) {
                await Credit.create(req.body);
                await Wallets.findOneAndUpdate({ userId: agentDetails[0]._id}, { $inc: { amount: +amount } });
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