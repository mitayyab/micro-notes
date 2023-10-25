import { ApiError, Type } from '@lib/error/ApiError';

export class NotFoundError extends ApiError {
   readonly id: string;

   constructor(id: string) {
      super(Type.NOT_FOUND, 'Record with this id does not exist');

      this.id = id;
   }
}
