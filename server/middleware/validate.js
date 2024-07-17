import Joi from "joi";

//schema validation
export const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((detail) => detail.message) });
  }
  next();
};
