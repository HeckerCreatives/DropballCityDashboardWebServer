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
claimCreditSchema.query.byFrom = function (senderUsername) {
  return this.where({ senderUsername });
};

claimCreditSchema.query.byTo = function (receiverUsername) {
  return this.where({ receiverUsername });
};

const ClaimCredit = mongoose.model("Credit", claimCreditSchema)

module.exports = ClaimCredit;