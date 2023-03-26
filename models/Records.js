const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    details: {
      type: String,
    },
    action: {
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

recordSchema.query.byUserId = function (userId) {
  return this.where({ userId });
};

const Records = mongoose.model("Records", recordSchema);

module.exports = Records;
