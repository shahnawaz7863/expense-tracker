import Joi from "joi";

const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other",
];

const expenseCategories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Rent",
  "Entertainment",
  "Health",
  "Education",
  "Subscription",
  "Other",
];

export const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),

  type: Joi.string()
    .valid("Income", "Expense")
    .required(),

  category: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required(),

  account: Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid account ID",
    }),

  note: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .default(""),

  date: Joi.date()
    .default(() => new Date()),

  attachment: Joi.string()
    .allow(null, "")
    .default(null),

  recurring: Joi.boolean()
    .default(false),

  recurrence: Joi.string()
    .valid("Daily", "Weekly", "Monthly", "Yearly")
    .allow(null)
    .default(null),
});