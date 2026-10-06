const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    if (source === "body") {
      req.body = value;
    } else if (source === "params") {
      req.params = value;
    } else if (source === "query") {
      Object.keys(req.query).forEach((key) => {
        delete req.query[key];
      });

      Object.assign(req.query, value);
    }

    next();
  };
};

export default validate;