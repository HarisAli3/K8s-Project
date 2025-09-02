const Joi = require('joi');

const studentSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 100 characters',
    'any.required': 'First name is required'
  }),
  last_name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 100 characters',
    'any.required': 'Last name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow('', null).messages({
    'string.pattern.base': 'Phone number must be between 10 and 15 digits'
  }),
  date_of_birth: Joi.alternatives().try(
    Joi.date().max('now'),
    Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
    Joi.string().allow('', null)
  ).optional().messages({
    'date.max': 'Date of birth cannot be in the future',
    'string.pattern.base': 'Date of birth must be in YYYY-MM-DD format'
  }),
  address: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Address cannot exceed 500 characters'
  })
});

const validateStudent = (req, res, next) => {
  const { error, value } = studentSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  req.body = value;
  next();
};

module.exports = { validateStudent };
