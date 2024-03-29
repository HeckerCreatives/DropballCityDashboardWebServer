const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    tongAmount: {
      type: String,
      required: true
    },
    loseAmount: {
      type: String,
      required: true
    },
    adminUsername: {
      type: String,
      required: true,
    },
    playerUsername: {
      type: String,
    },
    silverUsername: {
      type: String,
    },
    goldUsername: {
      type: String,
    },
    adminAmount: {
      type: Number,
    },
    silverAmount: {
      type: Number
    }, 
    goldAmount: {
      type: Number
    },
    potAmount: {
      type: Number
    },
    commissionAmount: {
      type: Number
    },
    Game:{
      type: String,
      required: true
    },
    Round:{
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);
const TransactionHistory = mongoose.model("TransactionHistory", requestSchema);

module.exports = TransactionHistory;
