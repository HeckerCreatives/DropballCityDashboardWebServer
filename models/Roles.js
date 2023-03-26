const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    display_name: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Roles = mongoose.model("Roles", roleSchema);

module.exports = Roles;
