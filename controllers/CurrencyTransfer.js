const Currency = require("../models/CurrencyTransfer"),
    CurrencyTransferHistory = require("../models/CurrencyTransferHistory"),
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
        } else if (currency === currencyDC){
            await Wallets.findOneAndUpdate({userId: currentuser[0]._id}, {$inc: { amount: -amount }})
        } else {
            return "failed"
        }

        const currencytransactionhistory = {
            user: currentUsername,
            usertransferAmount: amount,
        }
        
        await CurrencyTransferHistory.create(currencytransactionhistory)


        response.json({response: "success"})
        await session.commitTransaction();
    } catch (error){
        await session.abortTransaction();
        response.json(error);
    }
    session.endSession();
    
}