import { Validator, simplifyJoiError } from '@lib/validator/joi';
import Joi, { ValidationError } from 'joi';
import { Level, Quiz } from './quiz.model';

const schema = Joi.object({
   title: Joi.string().alter({
      post: schema => schema.required(),
      put: schema => schema.optional(),
   }),
   topics: Joi.array()
      .items(Joi.string())
      .min(1)
      .alter({
         post: schema => schema.required(),
         put: schema => schema.optional(),
      }),
   level: Joi.string()
      .valid(...Object.values(Level))
      .alter({
         post: schema => schema.required(),
         put: schema => schema.optional(),
      }),
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
               .min(2)
               .required(),
         }),
      )
      .min(1)
      .alter({
         post: schema => schema.required(),
         put: schema => schema.optional(),
      }),
});

const postSchema = schema.tailor(['post']);
const putSchema = schema.tailor(['put']);

export const validate: Validator<Quiz> = (quiz: Quiz) => {
   const validationResult = postSchema.validate(quiz, { abortEarly: false });
   const error: ValidationError = validationResult.error!;

   return simplifyJoiError(error);
};

export const updateQuizvalidate: Validator<Quiz> = (quiz: Quiz) => {
   const validationResult = putSchema.validate(quiz, { abortEarly: false });
   const error: ValidationError = validationResult.error!;
   return simplifyJoiError(error);
};
