import Joi from 'joi';

export const validateItem = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive').required(),
  tags: Joi.array().items(Joi.string()).optional(),
});

export const validatePagination = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
  search: Joi.string().optional(),
});