import { Validator, simplifyJoiError } from '@lib/validator/joi';
import Joi, { ValidationError } from 'joi';
import { Level, Quiz } from './quiz.model';

const schema = Joi.object({
   title: Joi.string().required(),
   topics: Joi.array().items(Joi.string()).min(1).required(),
   level: Joi.string()
      .valid(...Object.values(Level))
      .required(),
   questions: Joi.array()
      .items(
         Joi.object({
            text: Joi.string().empty().required(),
            answerChoices: Joi.array()
               .items(
                  Joi.object({
                     text: Joi.string().empty().required(),
                     correct: Joi.boolean().required(),
                  }),
               )
               .min(2),
         }).min(1),
      )
      .min(1),
});

export const validate: Validator<Quiz> = (quiz: Quiz) => {
   const validationResult = schema.validate(quiz, { abortEarly: false });
   const error: ValidationError = validationResult.error!;

   return simplifyJoiError(error);
};
