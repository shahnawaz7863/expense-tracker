import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

import { calculateNextOccurrence } from "./recurrence.js";

export const processRecurringTransactions = async () => {
  try {
    const now = new Date();

    const recurringTransactions = await Transaction.find({
      recurring: true,
      nextOccurrence: { $lte: now },
    });

    for (const transaction of recurringTransactions) {
      // Find account
      const account = await Account.findOne({
        _id: transaction.account,
        user: transaction.user,
        isActive: true,
      });

      if (!account) {
        console.error(
          `Account not found for recurring transaction: ${transaction._id}`
        );

        continue;
      }

      const newTransaction = await Transaction.create({
        user: transaction.user,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        account: transaction.account,
        note: transaction.note,
        date: transaction.nextOccurrence,
        attachment: transaction.attachment,
        recurring: true,
        recurrence: transaction.recurrence,
        nextOccurrence: calculateNextOccurrence(
          transaction.nextOccurrence,
          transaction.recurrence
        ),
      });

      // Update account balance
      if (transaction.type === "Income") {
        account.balance += transaction.amount;
      } else {
        account.balance -= transaction.amount;
      }

      await account.save();

      // Update next occurrence
      transaction.nextOccurrence = newTransaction.nextOccurrence;

      await transaction.save();
    }

    console.log(
      `Recurring transactions processed: ${recurringTransactions.length}`
    );
  } catch (error) {
    console.error(
      "Recurring transaction processing failed:",
      error.message
    );
  }
};