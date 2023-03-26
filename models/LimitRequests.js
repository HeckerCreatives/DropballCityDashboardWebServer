const mongoose = require("mongoose");

const limitRequestSchema = new mongoose.Schema(
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

limitRequestSchema.query.byFrom = function (from) {
  return this.where({ from });
};

limitRequestSchema.query.byTo = function (to) {
  return this.where({ to });
};

const LimitRequests = mongoose.model("LimitRequests", limitRequestSchema);

module.exports = LimitRequests;
