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
        // goldUsername,
        // silverUsername,
        // adminUsername,
        // playerUsername,
    } = request.body

    // const users = await Users.find({username: [goldUsername, silverUsername, adminUsername,
    //     playerUsername]})
    // const goldDetails = users.filter((i => i.username == goldUsername));
    // const silverDetails = users.filter((i => i.username == silverUsername));
    // const adminDetails = users.filter((i => i.username == adminUsername));
    // const playerDetails = users.filter((i => i.username == playerUsername));

    const currencyIC = "IC" //(initialcredit - amount)    
    const currencyDC = "DC" //(gamecredit - amount)    

    const session = await Currency.startSession();
    try {
        session.startTransaction();
        const admin = await Users.find({username: "Admin"})
        const gold = await Users.find({username: "goldDeveloper"})

        if(currency === currencyIC){
            await Wallets.findOneAndUpdate({userId: admin[0]._id}, {$inc: { initial: -amount}})
        } else if (currency === currencyDC){
            await Wallets.findOneAndUpdate({userId: gold[0]._id}, {$inc: { amount: -amount }})
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






    // const { username, amount } = request.body

    // const session = await Currency.startSession();
    // try {
    //     session.startTransaction();
    //     const users = await Users.find({username: ['Admin', username]})
    //     const adminDetails = users.filter((i) => i.username == 'Admin')
    //     const userDetails = users.filter((i) => i.username == username)
    //     const adminWallet = await Wallets.find({ "userId": adminDetails[0]?._id })
    //     const userWallet = await Wallets.find({ "userId": userDetails[0]?._id })

    //     // const usercredit = userDetails.length !==0 ? (gamecredit - amount) : 0;
    //     // const admincredit = adminDetails.length !==0 ? (initialcredit - amount) : 0;


    //     // const transferamount = {
    //     //     user: userDetails.username,
    //     //     adminuser: adminDetails.username,
    //     //     usertransferamount: usercredit,
    //     //     admintransferamount: admincredit
    //     // }

    //     if (userDetails.length !== 0){
            
    //         await Wallets.findOneAndUpdate({ userId: userDetails[0]._id}, { $inc: { initial: -amount, amount: -amount } });  
            
    //         await Wallets.findOneAndUpdate({ userId: adminDetails[0]._id}, { $inc: { initial: -amount, amount: -amount } });
            
    //         await session.commitTransaction();
    //         response.json({response: "success"})
    //         // await CurrencyTransferHistory.create(transferamount)
    //     } else {
    //         await  session.abortTransaction();
    //         response.json({ response: "failed" })
    //     }
            
    // } catch (error){
    //     await  session.abortTransaction();
    //     response.json(error)
    // }
    
}