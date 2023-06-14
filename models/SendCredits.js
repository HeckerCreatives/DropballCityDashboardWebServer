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

sendCreditSchema.query.byFrom = function (senderUsername) {
  return this.where({ senderUsername });
};

sendCreditSchema.query.byTo = function (receiverUsername) {
  return this.where({ receiverUsername });
};

const SendCredit = mongoose.model("SendCredit", sendCreditSchema)

module.exports = SendCredit;