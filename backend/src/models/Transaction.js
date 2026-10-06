import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01,
        },

        type: {
            type: String,
            enum: ["Income", "Expense"],
            required: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },

        note: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        date: {
            type: Date,
            required: true,
            default: Date.now,
        },

        attachment: {
            type: String,
            default: null,
        },

        recurring: {
            type: Boolean,
            default: false,
        },

        recurrence: {
            type: String,
            enum: ["Daily", "Weekly", "Monthly", "Yearly", null],
            default: null,
        },

        nextOccurrence: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

transactionSchema.index({ user: 1, date: -1 });

const Transaction = mongoose.model(
    "Transaction",
    transactionSchema
);

export default Transaction;