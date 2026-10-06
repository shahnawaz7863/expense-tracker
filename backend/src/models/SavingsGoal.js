import mongoose from "mongoose";

const savingsGoalSchema = new mongoose.Schema(
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
      maxlength: 100,
    },

    targetAmount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    targetDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

savingsGoalSchema.index({ user: 1, targetDate: 1 });

const SavingsGoal = mongoose.model(
  "SavingsGoal",
  savingsGoalSchema
);

export default SavingsGoal;