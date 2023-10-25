import Joi from "joi";
import { Result } from "./result.model";
import { Validator, simplifyJoiError } from "@lib/validator/joi";

const schema = Joi.object({
   user: Joi.string().empty().required(),

   quiz: Joi.string().empty().required(),

   answers: Joi.array()
      .items(
         Joi.object({
            questionNumber: Joi.number().empty().required(),
            selectedChoice: Joi.string().empty().required(),
         }),
      )
      .min(1)
      .required(),
});

export const resultValidate: Validator<Result> = (result:Result) => {
   const validationResult = schema.validate(result, {abortEarly: false});
   const error = validationResult.error!;

   return simplifyJoiError(error);
}