// import { Validator, simplifyJoiError } from '@lib/validator/joi';
// import Joi, { ValidationError } from 'joi';
// import { Level, Quiz } from './quiz.model';

// const schema = Joi.object({
//    title: Joi.string().required(),
//    topics: Joi.array().items(Joi.string()).min(1).required(),
//    level: Joi.string()
//       .valid(...Object.values(Level))
//       .required(),
//    questions: Joi.array()
//       .items(
//          Joi.object({
//             text: Joi.string().empty().required(),
//             answerChoices: Joi.array()
//                .items(
//                   Joi.object({
//                      text: Joi.string().empty().required(),
//                      correct: Joi.boolean().required(),
//                   })
//                )
//                .min(2).required(),
//          })
//       )
//       .min(1).required(),
// });

// export const validate: Validator<Quiz> = (quiz: Quiz) => {
//    const validationResult = schema.validate(quiz, { abortEarly: false });
//    const error: ValidationError = validationResult.error!;

//    return simplifyJoiError(error);
// };

// const updateSchema = Joi.object({
//    title: Joi.string().optional(),
//    topics: Joi.array().items(Joi.string()).min(1).optional(),
//    level: Joi.string()
//       .valid(...Object.values(Level))
//       .optional(),
//    questions: Joi.array()
//       .items(
//          Joi.object({
//             text: Joi.string().empty().required(),
//             answerChoices: Joi.array()
//                .items(
//                   Joi.object({
//                      text: Joi.string().empty().required(),
//                      correct: Joi.boolean().required(),
//                   })
//                )
//                .min(2)
//                .required(),
//          })
//       )
//       .min(1).optional(),
// });

// export const updateQuizvalidate: Validator<Quiz> = (quiz: Quiz) => {
//    const validationResult = updateSchema.validate(quiz, { abortEarly: false });
//    const error: ValidationError = validationResult.error!;

//    return simplifyJoiError(error);
// };

// export const questionSchema = Joi.object({
//    question:
//          Joi.object({
//             text: Joi.string().empty().required(),
//             answerChoices: Joi.array()
//                .items(
//                   Joi.object({
//                      text: Joi.string().empty().required(),
//                      correct: Joi.boolean().required(),
//                   })
//                )
//                .min(2)
//                .required(),
//          })
// });

// export const updateQuestionvalidate = (question) => {
//    const validationResult = questionSchema.validate(question, {
//       abortEarly: false,
//    });
//    const error: ValidationError = validationResult.error!;

//    return simplifyJoiError(error);
// };

import { Validator, simplifyJoiError } from '@lib/validator/joi';
import Joi, { ValidationError } from 'joi';
import { Level, Quiz } from './quiz.model';

const questionSchema = Joi.object({
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
      .items(questionSchema)
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

export const updateQuestionvalidate: Validator<Quiz> = (quiz: Quiz) => {
   const validationResult = questionSchema.validate(quiz, {
      abortEarly: false,
   });
   const error: ValidationError = validationResult.error!;

   return simplifyJoiError(error);
};
