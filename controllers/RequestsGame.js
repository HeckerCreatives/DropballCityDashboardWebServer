const RequestsGame = require("../models/RequestsGame"),
    Wallets = require("../models/Wallets"),
    Users = require("../models/Users");

// entity/save
exports.transfer = async (req, res) => {
  const { username, amount } = req.body
  const session = await RequestsGame.startSession();
  try { 
    session.startTransaction();                  
    const users = await Users.find({ username: [ 'Admin', username ] })
    const adminDetails = users.filter((i) => i.username == 'Admin')    
    const userDetails = users.filter((i) => i.username == username)  
    const adminWallet = await Wallets.find({ "userId": adminDetails[0]?._id })

      if (userDetails.length !== 0 ) {
        if (adminWallet[0].amount > amount) {
            await RequestsGame.create(req.body);
            await Wallets.findOneAndUpdate({ userId: adminDetails[0]._id}, { $inc: { amount: -amount } });
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

  // Users.find({ username: [ 'Admin', username ] }).then((userItems) => {
  //   const adminDetails = userItems.filter((i) => i.username == 'Admin')    
  //   const userDetails = userItems.filter((i) => i.username == username)    
  //   Wallets.find({ "userId": adminDetails[0]?._id }).then((walletItems) => {
  //     if(adminDetails[0].username === "Admin") {
  //       if (walletItems[0].amount > amount) {

  //           Wallets.findOneAndUpdate({ userId: adminDetails[0]._id}, { $inc: { amount: -amount } })
  //           .then().catch();
  //           Wallets.findOneAndUpdate({ userId: userDetails[0]._id }, { $inc: { amount: +amount } })
  //           .then().catch();
  //           RequestsGame.create(req.body)
  //           .then()
  //           .catch(error => res.status(400).json(error));

  //         await session.commitTransaction();
  //         session.endSession();
  //         return res.send({ status: 'User deleted', ...deletedUser, appDeletedCount: app.deletedCount });

  //       } else {
  //           session.abortTransaction();
  //           session.endSession();
  //           res.json({ response: "failed" });
  //       }
  //     }
  //   }).catch((err) => {
  //     session.abortTransaction();
  //     session.endSession();
  //   })
  // }).catch((err) => {
  //     session.abortTransaction();
  //     session.endSession();
  // })
  
}



