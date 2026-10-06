import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import Account from "../models/Account.js";

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const summary = await Transaction.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: "$type",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach((item) => {
      if (item._id === "Income") {
        totalIncome = item.total;
      }

      if (item._id === "Expense") {
        totalExpense = item.total;
      }
    });

    const accountSummary = await Account.aggregate([
      {
        $match: {
          user: userId,
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalBalance: {
            $sum: "$balance",
          },
        },
      },
    ]);

    const totalBalance =
      accountSummary.length > 0
        ? accountSummary[0].totalBalance
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalBalance,
        totalIncome,
        totalExpense,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseByCategory = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "Expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    console.log("CATEGORY AGGREGATION:", expenses);

    return res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error("CATEGORY ERROR:", error);
    next(error);
  }
};

export const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const analytics = await Transaction.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: {
            month: {
              $dateToString: {
                format: "%Y-%m",
                date: "$date",
              },
            },
            type: "$type",
          },
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          income: {
            $sum: {
              $cond: [
                { $eq: ["$_id.type", "Income"] },
                "$total",
                0,
              ],
            },
          },
          expense: {
            $sum: {
              $cond: [
                { $eq: ["$_id.type", "Expense"] },
                "$total",
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          income: 1,
          expense: 1,
        },
      },
      {
        $sort: {
          month: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};


export const getRecentTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.userId,
    })
      .populate("account", "name type balance currency")
      .sort({ date: -1 })
      .limit(5)
      .lean();

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};