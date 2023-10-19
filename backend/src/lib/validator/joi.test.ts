import { simplifyJoiError } from '@lib/validator/joi';
import Joi, { AnySchema } from 'joi';

const validate = (
   schema: AnySchema,
   data: any
): SimplifiedErrors | undefined => {
   const validationResult = schema.validate(data, {
      abortEarly: false,
   });

   return validationResult.error
      ? simplifyJoiError(validationResult.error)
      : undefined;
};

type SimplifiedErrors = Record<string, any> | any[];

describe('simplifyJoiError', () => {
   it('should simplify nested error objects maintaining input structure', () => {
      const schema = Joi.object({
         name: Joi.object({
            first: Joi.string().min(3).required(),
            last: Joi.string().min(3).required(),
         }).required(),
         email: Joi.string().email().required(),
         password: Joi.string().min(6).required(),
      });

      const data = {
         name: {
            first: 'f',
            last: 'l',
         },
         email: 'notanemail',
         password: '123',
      };

      expect(validate(schema, data)).toEqual({
         name: {
            first: '"name.first" length must be at least 3 characters long',
            last: '"name.last" length must be at least 3 characters long',
         },
         email: '"email" must be a valid email',
         password: '"password" length must be at least 6 characters long',
      });
   });

   it('should handle if input has array children', () => {
      const schema = Joi.object({
         title: Joi.string().required(),
         tags: Joi.array().items(Joi.string().required()).min(1),
      });

      const data = {
         title: 'Functional programming',
         tags: ['Elm', ''],
      };

      expect(validate(schema, data)).toEqual({
         tags: [undefined, '"tags[1]" is not allowed to be empty'],
      });
   });

   it('should handle if input itself is an array', () => {
      const schema = Joi.array().items(Joi.string().required()).min(1);

      const data = ['Elm', ''];

      expect(validate(schema, data)).toEqual([
         undefined,
         '"[1]" is not allowed to be empty',
      ]);
   });

   it('should handle if there are no validation errors', () => {
      const schema = Joi.object({
         email: Joi.string().email().required(),
         password: Joi.string().min(6).required(),
      });

      const data = {
         email: 'valid@email.co',
         password: '123456',
      };

      expect(validate(schema, data)).toBeUndefined();
   });
});
