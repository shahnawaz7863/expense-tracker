import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    spent: {
      type: Number,
      default: 0,
      min: 0,
    },

    period: {
      type: String,
      enum: ["Monthly", "Yearly"],
      default: "Monthly",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
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

budgetSchema.index({ user: 1, category: 1, startDate: 1 });

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;