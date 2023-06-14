const Currency = require("../models/CurrencyTransfer"),
    CurrencyTransferHistory = require("../models/CurrencyTransferHistory"),
    InitialCoinHistory = require("../models/InitialCoinHistory"),
    Wallets = require("../models/Wallets"),
    Users = require("../models/Users");

exports.convertCurrency = async (request, response) => {
    const {
        amount,
        currency,
        // initialcredit,
        // gamecredit,
       currentUsername,
    } = request.body
        
    
    const users = await Users.find({ username: [ currentUsername ] })
    const goldDetails = users.filter((i => i.username == currentUsername));
    
    const currencyIC = "IC" //(initialcredit - amount)    
    const currencyDC = "DC" //(gamecredit - amount)    

    const session = await Currency.startSession();
    try {
        session.startTransaction();
        const currentuser = await Users.find({username: currentUsername})

        if(currency === currencyIC){
            await Wallets.findOneAndUpdate({userId: currentuser[0]._id}, {$inc: { initial: -amount}})
            const initialcoinhistory = {
                user: currentUsername,
                usertransferAmount: amount,
            }            
            await InitialCoinHistory.create(initialcoinhistory)
        } else if (currency === currencyDC){
            await Wallets.findOneAndUpdate({userId: currentuser[0]._id}, {$inc: { amount: -amount }})
            const currencytransactionhistory = {
                user: currentUsername,
                usertransferAmount: amount,
            }            
            await CurrencyTransferHistory.create(currencytransactionhistory)
        } else {
            return "failed"
        }       

        response.json({response: "success"})
        await session.commitTransaction();
    } catch (error){
        await session.abortTransaction();
        response.json(error);
    }
    session.endSession();
    
}

exports.browsedc = (req, res) =>
  CurrencyTransferHistory.find()
    .then(items => res.json(items))
    .catch(error => res.status(400).json({ error: error.message }));

exports.browseic = (req, res) =>
    InitialCoinHistory.find()
      .then(items => res.json(items))
      .catch(error => res.status(400).json({ error: error.message }));