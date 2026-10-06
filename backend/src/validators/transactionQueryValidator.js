import Joi from "joi";

export const transactionQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),

  type: Joi.string()
    .valid("Income", "Expense")
    .allow(""),

  category: Joi.string()
    .trim()
    .max(50)
    .allow(""),

  account: Joi.string().hex().length(24).allow(""),
  startDate: Joi.date().allow(""),
  endDate: Joi.date().min(Joi.ref("startDate")).allow(""),

  minAmount: Joi.number()
    .min(0)
    .allow(""),

  maxAmount: Joi.number()
    .min(Joi.ref("minAmount"))
    .allow(""),

  search: Joi.string().trim().max(100).allow(""),
}).unknown(false);