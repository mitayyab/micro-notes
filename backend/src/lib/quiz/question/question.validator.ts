import Joi, { ValidationError } from 'joi';

import { Validator, simplifyJoiError } from '@lib/validator/joi';
import { Question } from './question.model';

export const questionSchema = Joi.object({
   text: Joi.string().empty().required(),
   answerChoices: Joi.array()
      .items(
         Joi.object({
            text: Joi.string().empty().required(),
            correct: Joi.boolean().required(),
         }),
      )
      .min(2)
      .required(),
});

export const updateQuestionValidate: Validator<Question> = (
   question: Question,
) => {
   const validationResult = questionSchema.validate(question, {
      abortEarly: false,
   });
   const error: ValidationError = validationResult.error!;

   return simplifyJoiError(error);
};
