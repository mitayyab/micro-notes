import Joi, { ValidationError } from 'joi';
import { Validator, simplifyJoiError } from '@lib/validator/joi';

export type Credentials = {
   username: string;
   password: string;
};

const schema = Joi.object({
   username: Joi.string().email().required(),
   password: Joi.string().required().messages({
      'string.pattern.base':
         'Password needs 8+ characters, including 1 uppercase, lowercase, number, and special character.',
   }),
});

export const validate: Validator<Credentials> = (credentials: Credentials) => {
   const validationResult = schema.validate(credentials, { abortEarly: false });
   const error: ValidationError = validationResult.error!;

   return simplifyJoiError(error);
};
