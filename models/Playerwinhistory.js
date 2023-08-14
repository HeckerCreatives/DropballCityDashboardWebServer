
const mongoose = require("mongoose");

const playerWinHistorySchema = new mongoose.Schema(
    {
        Player: {
            type: String,
            required: true
        },
        Agent: {
            type: String,
            required: true
        },
        WinAmount:{
            type: Number,
            required: true
        }
    },
    {
        timestamps: true,
    }
)

const PlayerWinHistory = mongoose.model("PlayerWinHistory", playerWinHistorySchema)

module.exports = PlayerWinHistory;