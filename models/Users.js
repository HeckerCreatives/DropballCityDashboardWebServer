const mongoose = require("mongoose"),
{ bcrypt } = require("bcryptjs");

const subcriptionExpiryDate = function() {
    let d = new Date();
    d.setMonth(date.getMonth() + 1);
    return d.toISOString();
};

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 5,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
    },
    playfabId: {
      type: String,
      // required: true,
    },
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    refLimit: {
      type: Number,
      default: 300,
    },
    subscriptionStart: {
      type: String,
      default: new Date().toISOString()
    },
    subscriptionEnd: {
      type: String,
      default: function() {
          let d = new Date();
          d.setMonth(d.getMonth() + 1);
          return d.toISOString();
      }
    },
    deletedAt: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.query.byRefferal = function (referrerId) {
  return this.where({ referrerId });
};

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
