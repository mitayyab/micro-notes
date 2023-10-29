import Joi from "joi";
import { Result } from "./result.model";
import { Validator, simplifyJoiError } from "@lib/validator/joi";
import { Level } from "@lib/quiz/quiz.model";

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

const attemptedQuizSchema = Joi.object({
   title: Joi.string().empty().required(),
   topics: Joi.array().items(Joi.string()).min(1).required(),
   level: Joi.string()
      .valid(...Object.values(Level))
      .required(),

   questions: Joi.array().items(questionSchema).min(1).required(),
});

export const createResultValidate: Validator<Result> = (result: Result) => {
   const validationResult = attemptedQuizSchema.validate(result, {
      abortEarly: false,
   });
   const error = validationResult.error!;

   return simplifyJoiError(error);
};