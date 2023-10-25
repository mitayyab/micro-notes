import Joi from "joi";
import { Result } from "./result.model";
import { Validator, simplifyJoiError } from "@lib/validator/joi";
import { Level } from "@lib/quiz/quiz.model";

// const schema = Joi.object({
//    user: Joi.string().empty().required(),

//    quiz: Joi.string().empty().required(),

//    answers: Joi.array()
//       .items(
//          Joi.object({
//             questionNumber: Joi.number().empty().required(),
//             selectedChoice: Joi.string().empty().required(),
//          }),
//       )
//       .min(1)
//       .required(),
// });

// export const resultValidate: Validator<Result> = (result:Result) => {
//    const validationResult = schema.validate(result, {abortEarly: false});
//    const error = validationResult.error!;

//    return simplifyJoiError(error);
// }


export const questionSchema = Joi.object({
   text: Joi.string().empty().required(),
   answerChoices: Joi.array()
      .items(
         Joi.object({
            text: Joi.string().empty().required(),
            correct: Joi.boolean().required(),
            selected: Joi.boolean().required(),
         }),
      )
      .min(2)
      .required(),
});

const quizSchema = Joi.object({
   title: Joi.string().empty().required(),
   topics: Joi.array().items(Joi.string()).min(1).required(),
   level: Joi.string()
      .valid(...Object.values(Level))
      .required(),

   questions: Joi.array().items(questionSchema).min(1).required(),
});

const resultSchema = Joi.object({
   quiz: quizSchema,
});

export const createResultValidate: Validator<Result> = (result: Result) => {
   const validationResult = resultSchema.validate(result, {
      abortEarly: false,
   });
   const error = validationResult.error!;

   return simplifyJoiError(error);
};