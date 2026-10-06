import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    type: {
      type: String,
      enum: ["Cash", "Bank", "UPI", "Wallet", "Credit Card", "Other"],
      required: true,
    },

    balance: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "INR",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.index({ user: 1, name: 1 });

const Account = mongoose.model("Account", accountSchema);

export default Account;