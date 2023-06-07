const mongoose = require("mongoose")

const claimCreditSchema = new mongoose.Schema(
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

const ClaimCredit = mongoose.model("Credit", claimCreditSchema)

module.exports = ClaimCredit;