import { ApiError, Type } from '@lib/error/ApiError';

export class DuplicateError extends ApiError {
   readonly field: Record<string, any>;

   constructor(keyValue: Record<string, any>) {
      super(
         Type.UNIQUE_FIELD_VOILATION,
         'Record with same field already exists'
      );

      this.field = keyValue;
   }
}
