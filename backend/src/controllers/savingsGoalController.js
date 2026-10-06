import SavingsGoal from "../models/SavingsGoal.js";

export const createSavingsGoal = async (req, res, next) => {
  try {
    if (req.body.currentAmount > req.body.targetAmount) {
      return res.status(400).json({
        success: false,
        message: "Current amount cannot exceed target amount",
      });
    }

    const goal = await SavingsGoal.create({
      name: req.body.name,
      targetAmount: req.body.targetAmount,
      currentAmount: req.body.currentAmount,
      targetDate: req.body.targetDate,
      description: req.body.description,
      status: req.body.status,
      user: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Savings goal created successfully",
      goal,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavingsGoals = async (req, res, next) => {
  try {
    const goals = await SavingsGoal.find({
      user: req.user.userId,
    }).sort({ targetDate: 1 });

    return res.status(200).json({
      success: true,
      goals,
    });
  } catch (error) {
    next(error);
  }
};


export const updateSavingsGoal = async (req, res, next) => {
  try {
    if (req.body.currentAmount > req.body.targetAmount) {
      return res.status(400).json({
        success: false,
        message: "Current amount cannot exceed target amount",
      });
    }

    const goal = await SavingsGoal.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        name: req.body.name,
        targetAmount: req.body.targetAmount,
        currentAmount: req.body.currentAmount,
        targetDate: req.body.targetDate,
        description: req.body.description,
        status: req.body.status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Savings goal updated successfully",
      goal,
    });
  } catch (error) {
    next(error);
  }
};



export const deleteSavingsGoal = async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Savings goal deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};