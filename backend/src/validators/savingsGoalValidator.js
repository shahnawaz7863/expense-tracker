import Joi from "joi";

export const savingsGoalSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  targetAmount: Joi.number()
    .positive()
    .required(),

  currentAmount: Joi.number()
    .min(0)
    .default(0),

  targetDate: Joi.date()
    .required(),

  description: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .default(""),

  status: Joi.string()
    .valid("Active", "Completed", "Cancelled")
    .default("Active"),
});