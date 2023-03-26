const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 5    
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String
    }, 
    time: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);
const RequestsGame = mongoose.model("RequestsGame", requestSchema);

module.exports = RequestsGame;
