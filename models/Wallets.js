const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    amount: {
      type: Number,
    },
    initial: {
      type: Number,
    },
    tong: {
      type: Number,
    },
    commission: {
      type: Number,
      default: 0
    },
    pot: {
      type: Number,
    },
    deletedAt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Wallets = mongoose.model("Wallets", walletSchema);

module.exports = Wallets;
