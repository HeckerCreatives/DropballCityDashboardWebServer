const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    amount: {
        type: Number,        
    },
    initialcredit: {
        type: Number,
    },
    gamecredit: {
        type: Number,
    }
}
);

const Currency = mongoose.model("Currency", currencySchema)

module.exports = Currency;