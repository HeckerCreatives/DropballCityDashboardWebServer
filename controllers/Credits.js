const SendCredit = require("../models/SendCredits"),
    ClaimCredit = require("../models/Claimcredits"),
    Wallets = require("../models/Wallets"),
    Users = require("../models/Users");

exports.send = async (req, res) => {
    const { username, agentusername, amount } = req.body
    const session = await SendCredit.startSession();
    try { 
      session.startTransaction();                  
    
       const agentDetails = await Users.findOne({ username: agentusername })
       .populate({
       path: "roleId",
       select: "name",
       });
      
      const userDetails = await Users.findOne({ username: username })
      const agentWallet = await Wallets.find({ "userId": agentDetails._id })

      const sendhistory = {
        senderUsername: agentDetails,
        receiverUsername: userDetails,
        amount: amount
      }
        if (agentDetails.roleId.name === "admin") {
            
          if (userDetails.length !== 0) {
            
            if (agentWallet[0].amount >= amount) {                
                
                await Wallets.findOneAndUpdate({ userId: agentDetails._id}, { $inc: { amount: -amount } });
                await Wallets.findOneAndUpdate({ userId: userDetails._id }, { $inc: { amount: +amount } });
                await SendCredit.create(sendhistory);

              await session.commitTransaction();
              res.json({ response: "success" })
            } else {
               await  session.abortTransaction();
               res.json({ response: "failed" })
            }
          }
          
        } else if (agentDetails.roleId.name === "silver") {
            
            if (userDetails.length !== 0) {
                
                if (agentWallet[0].amount >= amount) {
                    
                    await SendCredit.create(sendhistory);
                    await Wallets.findOneAndUpdate({ userId: agentDetails._id}, { $inc: { amount: -amount } });
                    await Wallets.findOneAndUpdate({ userId: userDetails._id }, { $inc: { amount: +amount } });
        
                  await session.commitTransaction();
                  res.json({ response: "success" })
                } else {
                   await  session.abortTransaction();
                   res.json({ response: "failed" })
                }
            }            
        } else if (agentDetails.roleId.name === "gold") {
            
          if (userDetails.length !== 0) {
              
              if (agentWallet[0].amount >= amount) {
                  
                  await SendCredit.create(sendhistory);
                  await Wallets.findOneAndUpdate({ userId: agentDetails._id}, { $inc: { amount: -amount } });
                  await Wallets.findOneAndUpdate({ userId: userDetails._id }, { $inc: { amount: +amount } });
      
                await session.commitTransaction();
                res.json({ response: "success" })
              } else {
                 await  session.abortTransaction();
                 res.json({ response: "failed" })
              }
          }            
      } else if (agentDetails.roleId.name === "csr") {
            
        if (userDetails.length !== 0) {
            
            if (agentWallet[0].amount >= amount) {
                
                await SendCredit.create(sendhistory);
                await Wallets.findOneAndUpdate({ userId: agentDetails._id}, { $inc: { amount: -amount } });
                await Wallets.findOneAndUpdate({ userId: userDetails._id }, { $inc: { amount: +amount } });
    
              await session.commitTransaction();
              res.json({ response: "success" })
            } else {
               await  session.abortTransaction();
               res.json({ response: "failed" })
            }
        }            
      }
        
        else {
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
    const session = await ClaimCredit.startSession();
    try { 
      session.startTransaction();                  
    
       const agentDetails = await Users.findOne({ username: agentusername })
       .populate({
       path: "roleId",
       select: "name",
       });
      
      const userDetails = await Users.findOne({ username: username })
      const agentWallet = await Wallets.find({ "userId": agentDetails._id })
      const userWallet = await Wallets.find({ "userId": userDetails._id })

      const claimhistory = {
        senderUsername: userDetails,
        receiverUsername: agentDetails,
        amount: amount
      }
        if (agentDetails.roleId.name === "admin") {
            
          if (userDetails.length !== 0) {
            
            if (userWallet[0].amount >= amount) {
                
                await ClaimCredit.create(claimhistory);
                await Wallets.findOneAndUpdate({ userId: agentDetails._id}, { $inc: { amount: +amount } });
                await Wallets.findOneAndUpdate({ userId: userDetails._id }, { $inc: { amount: -amount } });
    
              await session.commitTransaction();
              res.json({ response: "success" })
            } else {
               await  session.abortTransaction();
               res.json({ response: "failed" })
            }
          }
          
        } else if (agentDetails.roleId.name === "silver") {
            
            if (userDetails.length !== 0) {
                
                if (userWallet[0].amount >= amount) {
                    
                    await ClaimCredit.create(claimhistory);
                    await Wallets.findOneAndUpdate({ userId: agentDetails._id}, { $inc: { amount: +amount } });
                    await Wallets.findOneAndUpdate({ userId: userDetails._id }, { $inc: { amount: -amount } });
        
                  await session.commitTransaction();
                  res.json({ response: "success" })
                } else {
                   await  session.abortTransaction();
                   res.json({ response: "failed" })
                }
            }            
        } else if (agentDetails.roleId.name === "gold") {
            
          if (userDetails.length !== 0) {
              
              if (userWallet[0].amount >= amount) {
                  
                  await ClaimCredit.create(claimhistory);
                  await Wallets.findOneAndUpdate({ userId: agentDetails._id}, { $inc: { amount: +amount } });
                  await Wallets.findOneAndUpdate({ userId: userDetails._id }, { $inc: { amount: -amount } });
      
                await session.commitTransaction();
                res.json({ response: "success" })
              } else {
                 await  session.abortTransaction();
                 res.json({ response: "failed" })
              }
          }            
        } else if (agentDetails.roleId.name === "csr") {
            
          if (userDetails.length !== 0) {
              
              if (userWallet[0].amount >= amount) {
                  
                  await ClaimCredit.create(claimhistory);
                  await Wallets.findOneAndUpdate({ userId: agentDetails._id}, { $inc: { amount: +amount } });
                  await Wallets.findOneAndUpdate({ userId: userDetails._id }, { $inc: { amount: -amount } });
      
                await session.commitTransaction();
                res.json({ response: "success" })
              } else {
                 await  session.abortTransaction();
                 res.json({ response: "failed" })
              }
          }            
        } 
        
        else {
          await  session.abortTransaction();
          res.json({ response: "user does not exist" })
        }
    
    } catch (error) {
        await  session.abortTransaction();
        res.json(error)
    } 
     session.endSession();
}

exports.browsesend = (req, res) =>
  SendCredit.find()
    .populate({
      path: "receiverUsername",
      select: "username",
    })
    .populate({
      path: "senderUsername",
      select: "username",
    })
    .then(items => res.json(items))
    .catch(error => res.status(400).json({ error: error.message }));

exports.browseclaim = (req, res) =>
  ClaimCredit.find()
    .populate({
      path: "receiverUsername",
      select: "username",
    })
    .populate({
      path: "senderUsername",
      select: "username",
    })
    .then(items => res.json(items))
    .catch(error => res.status(400).json({ error: error.message }));

exports.findsendto = (req, res) =>
    SendCredit.find()
      .byTo(req.query.key)
      .populate({
        path: "receiverUsername",
        select: "username",
      })
      .populate({
        path: "senderUsername",
        select: "username",
      })
      .then(items => res.json(items))
      .catch(error => res.status(400).json({ error: error.message }));
  
  // entity/:userId/find
exports.findsendfrom = (req, res) =>
    SendCredit.find()
      .byFrom(req.params.userId)
      .populate({
        path: "receiverUsername",
        select: "username",
      })
      .populate({
        path: "senderUsername",
        select: "username",
      })
      .then(items => res.json(items))
      .catch(error => res.status(400).json({ error: error.message }));

exports.findclaimto = (req, res) =>
  ClaimCredit.find()
    .byTo(req.query.key)
    .populate({
      path: "receiverUsername",
      select: "username",
    })
    .populate({
      path: "senderUsername",
      select: "username",
    })
    .then(items => res.json(items))
    .catch(error => res.status(400).json({ error: error.message }));
    
    // entity/:userId/find
exports.findclaimfrom = (req, res) =>
  ClaimCredit.find()
    .byFrom(req.params.userId)
    .populate({
      path: "receiverUsername",
      select: "username",
    })
    .populate({
      path: "senderUsername",
      select: "username",
    })
    .then(items => res.json(items))
    .catch(error => res.status(400).json({ error: error.message }));      