import Joi from "joi";

export const categorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  type: Joi.string()
    .valid("Income", "Expense")
    .required(),

  isActive: Joi.boolean()
    .default(true),
});