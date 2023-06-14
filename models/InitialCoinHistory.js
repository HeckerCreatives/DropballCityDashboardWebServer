// This is for Initial Credit from Web to Game (Admin only)
const mongoose = require("mongoose");

const initialCoinHistorySchema = new mongoose.Schema(
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

const InitialCoinHistory = mongoose.model("InitialCoinHistory", initialCoinHistorySchema)

module.exports = InitialCoinHistory;