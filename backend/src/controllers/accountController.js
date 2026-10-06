import Account from "../models/Account.js";

export const createAccount = async (req, res, next) => {
  try {
    const account = await Account.create({
      name: req.body.name,
      type: req.body.type,
      balance: req.body.balance,
      currency: req.body.currency,
      isActive: req.body.isActive,
      user: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    const totalBalance = accounts.reduce(
      (total, account) => total + account.balance,
      0
    );

    return res.status(200).json({
      success: true,
      accounts,
      totalBalance,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAccount = async (req, res, next) => {
  try {
    const account = await Account.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        name: req.body.name,
        type: req.body.type,
        balance: req.body.balance,
        currency: req.body.currency,
        isActive: req.body.isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      account,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};