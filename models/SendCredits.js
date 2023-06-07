const mongoose = require("mongoose") 

const sendCreditSchema = new mongoose.Schema(
    {
      senderUsername:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      receiverUsername:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },      
        amount: {
        type: Number
      },
    },
    {
        timestamps: true
    }
)

const SendCredit = mongoose.model("SendCredit", sendCreditSchema)

module.exports = SendCredit;