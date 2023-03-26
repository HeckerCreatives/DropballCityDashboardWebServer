const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
    },
    deletedAt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

requestSchema.query.byFrom = function (from) {
  return this.where({ from });
};

requestSchema.query.byTo = function (to) {
  return this.where({ to });
};

const Cashouts = mongoose.model("Cashouts", requestSchema);

module.exports = Cashouts;
