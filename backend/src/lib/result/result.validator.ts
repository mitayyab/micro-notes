import Joi from 'joi';
import { Result } from './result.model';
import { Validator, simplifyJoiError } from '@lib/validator/joi';

const attemptedQuizSchema = Joi.object({
   quizId: Joi.string().empty().required(),
   attemptedQuestions: Joi.array()
      .items(Joi.string().empty().required())
      .min(1)
      .required(),
});

export const createResultValidate: Validator<Result> = (result: Result) => {
   const validationResult = attemptedQuizSchema.validate(result, {
      abortEarly: false,
   });
   const error = validationResult.error!;

   return simplifyJoiError(error);
};
