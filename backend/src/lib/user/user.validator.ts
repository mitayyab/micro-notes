import Joi, { ValidationError } from 'joi';
import { Validator, simplifyJoiError } from '@lib/validator/joi';
import { User } from './user.model';

const schema = Joi.object({
   firstName: Joi.string().required(),
   lastName: Joi.string().required(),
   email: Joi.string().email().required(),
   password: Joi.string()
      .pattern(
         new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
         ),
      )
      .required()
      .messages({
         'string.pattern.base':
            'Password needs 8+ characters, including 1 uppercase, lowercase, number, and special character.',
      }),
});

export const validate: Validator<User> = (user: User) => {
   const validationResult = schema.validate(user, { abortEarly: false });
   const error: ValidationError = validationResult.error!;

   return simplifyJoiError(error);
};
