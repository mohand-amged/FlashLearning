import Joi from 'joi';
 
export const flashcardSchema = Joi.object({
  front: Joi.string().min(1).required(),
  back: Joi.string().min(1).required(),
  subject: Joi.string().min(1).required(),
}); 