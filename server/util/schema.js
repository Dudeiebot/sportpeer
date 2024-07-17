import Joi from "joi";

//data integration checking at the backenc

export const registrationSchema = Joi.object({
  email: Joi.string().email().required(),

  phoneNos: Joi.string().required(),
  bio: Joi.string().max(500).required(),
  password: Joi.string().min(6).required(),

  sportInterest: Joi.array().items(Joi.string()).required(),

  verificationMethod: Joi.string().valid("email", "phone").required(),
});

export const loginSchema = Joi.object({
  access: Joi.alternatives()
    .try(Joi.string().email(), Joi.string().pattern(/^[0-9\s\-]+$/))
    .required(),
  password: Joi.string().min(6).required(),
});

export const updateUserNameSchema = Joi.object({
  userName: Joi.string().required(),
});

export const updateEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const updatePassSchema = Joi.object({
  oldPass: Joi.string().min(6).required(),
  newPass: Joi.string().min(6).required(),
});

export const verifyOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[0-9\s\-]+$/)
    .required(),
  otpCode: Joi.string().required(),
});
