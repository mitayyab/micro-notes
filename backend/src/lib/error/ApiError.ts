export enum Type {
   UNAUTHORIZED = 'UNAUTHORIZED',
   FORBIDDEN = 'FORBIDDEN',
   INVALID_INPUT = 'INVALID_INPUT',
   UNIQUE_FIELD_VOILATION = 'UNIQUE_FIELD_VOILATION',
}

export class ApiError extends Error {
   readonly type: Type;
   override readonly message: string;

   constructor(type: Type, message: string) {
      super(message);
      this.type = type;
      this.message = message;
   }
}
