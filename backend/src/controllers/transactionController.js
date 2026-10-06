import Account from "../models/Account.js";
import { Parser } from "json2csv";
import Transaction from "../models/Transaction.js";
import { calculateNextOccurrence } from "../utils/recurrence.js";

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// CREATE TRANSACTION
export const createTransaction = async (req, res, next) => {
    try {
        let nextOccurrence = null;

        const account = await Account.findOne({
            _id: req.body.account,
            user: req.user.userId,
            isActive: true,
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        if (req.body.recurring && req.body.recurrence) {
            nextOccurrence = calculateNextOccurrence(
                req.body.date,
                req.body.recurrence
            );
        }

        const transaction = await Transaction.create({
            amount: req.body.amount,
            type: req.body.type,
            category: req.body.category,
            account: req.body.account,
            note: req.body.note,
            date: req.body.date,
            attachment: req.body.attachment,
            recurring: req.body.recurring,
            recurrence: req.body.recurring
                ? req.body.recurrence
                : null,
            nextOccurrence,
            user: req.user.userId,
        });

        // Update account balance
        if (req.body.type === "Income") {
            account.balance += req.body.amount;
        } else {
            account.balance -= req.body.amount;
        }

        await account.save();

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction,
        });
    } catch (error) {
        next(error);
    }
};


// GET TRANSACTIONS
export const getTransactions = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            type,
            category,
            account,
            startDate,
            endDate,
            minAmount,
            maxAmount,
            search,
        } = req.query;

        const currentPage = Math.max(
            parseInt(page, 10) || 1,
            1
        );

        const perPage = Math.min(
            Math.max(parseInt(limit, 10) || 10, 1),
            100
        );

        const filter = {
            user: req.user.userId,
        };

        // Income / Expense filter
        if (type === "Income" || type === "Expense") {
            filter.type = type;
        }

        // Category filter
        // Category filter
        if (category) {
            const categoryValue = escapeRegex(category.trim());

            filter.category = {
                $regex: categoryValue,
                $options: "i",
            };
        }

        // Account filter
        if (account) {
            filter.account = account.trim();
        }

        // Date range filter
        if (startDate || endDate) {
            filter.date = {};

            if (startDate) {
                filter.date.$gte = new Date(
                    `${startDate}T00:00:00.000Z`
                );
            }

            if (endDate) {
                filter.date.$lte = new Date(
                    `${endDate}T23:59:59.999Z`
                );
            }
        }

        // Amount range filter
        if (minAmount || maxAmount) {
            filter.amount = {};

            if (minAmount) {
                filter.amount.$gte = Number(minAmount);
            }

            if (maxAmount) {
                filter.amount.$lte = Number(maxAmount);
            }
        }

        // Search by note, category or amount
        if (search) {
            const searchValue = escapeRegex(search.trim());

            const searchConditions = [
                {
                    note: {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
                {
                    category: {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
            ];

            const numericSearch = Number(searchValue);

            if (!Number.isNaN(numericSearch)) {
                searchConditions.push({
                    amount: numericSearch,
                });
            }

            filter.$or = searchConditions;
        }

        const skip = (currentPage - 1) * perPage;

        const [transactions, totalTransactions] =
            await Promise.all([
                Transaction.find(filter)
                    .populate("account", "name type balance currency")
                    .sort({ date: -1 })
                    .skip(skip)
                    .limit(perPage)
                    .lean(),

                Transaction.countDocuments(filter),
            ]);

        const totalPages = Math.ceil(
            totalTransactions / perPage
        );

        return res.status(200).json({
            success: true,
            data: transactions,
            pagination: {
                currentPage,
                perPage,
                totalTransactions,
                totalPages,
                hasNextPage: currentPage < totalPages,
                hasPreviousPage: currentPage > 1,
            },
        });
    } catch (error) {
        next(error);
    }
};


// UPDATE TRANSACTION
export const updateTransaction = async (req, res, next) => {
    try {
        // Find old transaction
        const oldTransaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!oldTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        // Find new account
        const account = await Account.findOne({
            _id: req.body.account,
            user: req.user.userId,
            isActive: true,
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        // Find old account
        const oldAccount = await Account.findOne({
            _id: oldTransaction.account,
            user: req.user.userId,
        });

        if (!oldAccount) {
            return res.status(404).json({
                success: false,
                message: "Old account not found",
            });
        }

        // Reverse old transaction impact
        if (oldTransaction.type === "Income") {
            oldAccount.balance -= oldTransaction.amount;
        } else {
            oldAccount.balance += oldTransaction.amount;
        }

        // Apply new transaction impact
        if (req.body.type === "Income") {
            account.balance += req.body.amount;
        } else {
            account.balance -= req.body.amount;
        }

        await oldAccount.save();
        await account.save();

        // Calculate next occurrence
        let nextOccurrence = null;

        if (req.body.recurring && req.body.recurrence) {
            nextOccurrence = calculateNextOccurrence(
                req.body.date,
                req.body.recurrence
            );
        }

        // Update transaction
        const transaction =
            await Transaction.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.user.userId,
                },
                {
                    amount: req.body.amount,
                    type: req.body.type,
                    category: req.body.category,
                    account: req.body.account,
                    note: req.body.note,
                    date: req.body.date,
                    attachment: req.body.attachment,
                    recurring: req.body.recurring,
                    recurrence: req.body.recurring
                        ? req.body.recurrence
                        : null,
                    nextOccurrence,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            transaction,
        });
    } catch (error) {
        next(error);
    }
};


// DELETE TRANSACTION
export const deleteTransaction = async (req, res, next) => {
    try {
        // Find transaction first
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        // Find related account
        const account = await Account.findOne({
            _id: transaction.account,
            user: req.user.userId,
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        // Reverse transaction impact
        if (transaction.type === "Income") {
            account.balance -= transaction.amount;
        } else {
            account.balance += transaction.amount;
        }

        await account.save();

        // Delete transaction
        await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId,
        });

        return res.status(200).json({
            success: true,
            message: "Transaction deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


// EXPORT TRANSACTIONS CSV
export const exportTransactionsCSV = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({
            user: req.user.userId,
        })
            .populate("account", "name")
            .sort({ date: -1 })
            .lean();

        const fields = [
            "date",
            "type",
            "amount",
            "category",
            "account.name",
            "note",
            "recurring",
            "recurrence",
        ];

        const parser = new Parser({ fields });

        const csv = parser.parse(transactions);

        res.header("Content-Type", "text/csv");
        res.attachment("transactions.csv");

        return res.status(200).send(csv);
    } catch (error) {
        next(error);
    }
};