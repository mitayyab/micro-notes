import { ApiError, Type } from '@lib/error/ApiError';
import { SimplifiedErrors } from '@lib/validator/joi';

export class RequestInputError extends ApiError {
   readonly errors: SimplifiedErrors;

   constructor(errors: SimplifiedErrors) {
      super(Type.INVALID_INPUT, 'Invalid request input');

      this.errors = errors;
   }
}
