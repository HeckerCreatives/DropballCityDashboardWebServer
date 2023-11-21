// This is for Game Credit Game to Web History
const mongoose = require("mongoose");

const CommiOnOffSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            required: true,
            default: "Off"
        }
    },
    {
        timestamps: true,
    }
)

const CommiOnOff = mongoose.model("CommiOnOff", CommiOnOffSchema)

module.exports = CommiOnOff;