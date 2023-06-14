// This is for Game Credit Game to Web History
const mongoose = require("mongoose");

const gcGametoWebHistorySchema = new mongoose.Schema(
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

const GCGametoWebHistory = mongoose.model("GCGametoWebHistory", gcGametoWebHistorySchema)

module.exports = GCGametoWebHistory;