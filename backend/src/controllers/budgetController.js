import Budget from "../models/Budget.js";
import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const createBudget = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const category = await Category.findOne({
      _id: req.body.category,
      user: userId,
      type: "Expense",
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Expense category not found",
      });
    }
    const spentResult = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "Expense",
          category: category.name,
          date: {
            $gte: new Date(req.body.startDate),
            $lte: new Date(req.body.endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const spent =
      spentResult.length > 0
        ? spentResult[0].total
        : 0;
    const budget = await Budget.create({
      category: category._id,
      amount: req.body.amount,
      spent: spent,
      period: req.body.period,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      isActive: req.body.isActive,
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgets = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const budgets = await Budget.find({
      user: userId,
      isActive: true,
    })
      .populate("category", "name type")
      .sort({ startDate: -1 })
      .lean();

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spentResult = await Transaction.aggregate([
          {
            $match: {
              user: userId,
              type: "Expense",
              category: budget.category.name,
              date: {
                $gte: budget.startDate,
                $lte: budget.endDate,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$amount",
              },
            },
          },
        ]);

        return {
          ...budget,
          spent:
            spentResult.length > 0
              ? spentResult[0].total
              : 0,
        };
      })
    );

    return res.status(200).json({
      success: true,
      budgets: budgetsWithSpent,
    });
  } catch (error) {
    next(error);
  }
};


export const updateBudget = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.body.category,
      user: req.user.userId,
      type: "Expense",
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Expense category not found",
      });
    }

    const budget = await Budget.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        category: category._id,
        amount: req.body.amount,
        spent: req.body.spent,
        period: req.body.period,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isActive: req.body.isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name type");

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    next(error);
  }
};



export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};