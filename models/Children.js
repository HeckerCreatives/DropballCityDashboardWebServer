const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    mname: {
      type: String,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      enum: {
        values: ["pending", "approved", "denied"],
        message: "{VALUE} is not supported",
      },
    },
    deletedAt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

childSchema.query.byStatus = function (status) {
  return this.where({ status: new RegExp(status, "i") });
};

const Children = mongoose.model("Children", childSchema);

module.exports = Children;
