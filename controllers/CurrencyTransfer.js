const Currency = require("../models/CurrencyTransfer"),
    CurrencyTransferHistory = require("../models/CurrencyTransferHistory"),
    Wallets = require("../models/Wallets"),
    Users = require("../models/Users");

exports.convertCurrency = async (request, response) => {
    const { username, amount, initialcredit, gamecredit } = request.body

    const session = await Currency.startSession();
    try {
        session.startTransaction();
        const users = await Users.find({username: ['Admin', username]})
        const adminDetails = users.filter((i) => i.username == 'Admin')
        const userDetails = users.filter((i) => i.username == username)
        const adminWallet = await Wallets.find({ "userId": adminDetails[0]?._id })
        const userWallet = await Wallets.find({ "userId": userDetails[0]?._id })

        const usercredit = userDetails.length !==0 ? (gamecredit - amount) : 0;
        const admincredit = adminDetails.length !==0 ? (initialcredit - amount) : 0;


        const transferamount = {
            user: userDetails,
            adminuser: adminDetails,
            usertransferamount: usercredit,
            admintransferamount: admincredit
        }

        if (userDetails.length !== 0){
            if(userWallet[0].amount > amount){
            await Wallets.findOneAndUpdate({ userId: userDetails[0]._id}, { $inc: { gamecredit: +amount, amount: -amount } });
            }
        } else if (adminDetails.length !==0) {
            if (adminWallet[0].amount > amount){
            await Wallets.findOneAndUpdate({ userId: adminDetails[0]._id}, { $inc: { initialcredit: +amount, amount: -amount } });
            }
            await CurrencyTransferHistory.create(transferamount)
        } else {
            await  session.abortTransaction();
            response.json({ response: "failed" })
        }
            await session.commitTransaction();
            response.json({response: "success"})
    } catch (error){
        await  session.abortTransaction();
        response.json({ response: "user not found" })
    }
    
}