// This is for Game credit to game history (All users except Admin)
const mongoose = require("mongoose");

const currencyHistorySchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true
        },
        usertransferAmount:{
            type: Number,
            required: true
        }
    },
    {
        timestamps: true,
    }
)

const CurrencyTransferHistory = mongoose.model("CurrencyTransferHistory", currencyHistorySchema)

module.exports = CurrencyTransferHistory;