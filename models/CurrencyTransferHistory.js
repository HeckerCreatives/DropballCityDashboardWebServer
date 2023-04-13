const mongoose = require("mongoose");

const currencyHistorySchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true
        },
        adminuser: {
            type: String,
            required: true
        },
        usertranferAmount:{
            type: Number,
            required: true
        },
        admintranferAmount:{
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