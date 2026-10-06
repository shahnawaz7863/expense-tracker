import Joi from "joi";

export const accountSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  type: Joi.string()
    .valid(
      "Cash",
      "Bank",
      "UPI",
      "Wallet",
      "Credit Card",
      "Other"
    )
    .required(),

  balance: Joi.number()
    .min(0)
    .default(0),

  currency: Joi.string()
    .trim()
    .default("INR"),

  isActive: Joi.boolean()
    .default(true),
});