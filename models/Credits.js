const mongoose = require("mongoose")

const creditSchema = new mongoose.Schema(
    {
      username:{
        type: String
      },
      date:{
        type: String
      },
        amount: {
        type: Number
      },
      time: {
        type: String
      }
    },
    {
        timestamps: true
    }
)

const Credit = mongoose.model("Credit", creditSchema)

module.exports = Credit;