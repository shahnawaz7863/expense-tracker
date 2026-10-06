import Joi from "joi";

export const budgetSchema = Joi.object({
  category: Joi.string()
    .trim()
    .required(),

  amount: Joi.number()
    .positive()
    .required(),

  spent: Joi.number()
    .min(0)
    .default(0),

  period: Joi.string()
    .valid("Monthly", "Yearly")
    .default("Monthly"),

  startDate: Joi.date()
    .required(),

  endDate: Joi.date()
    .required()
    .greater(Joi.ref("startDate")),

  isActive: Joi.boolean()
    .default(true),
});