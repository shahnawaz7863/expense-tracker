import Joi from "joi";

export const objectIdSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "Invalid ID format",
      "string.length": "Invalid ID length",
      "any.required": "ID is required",
    }),
});