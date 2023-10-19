import { ValidationError, ValidationErrorItem } from 'joi';

export type Validator<T> = {
   (input: T): SimplifiedErrors;
};

export type SimplifiedErrors = Record<string, any>;

const initialize = (pathHead: string | number) =>
   typeof pathHead === 'number' ? [] : {};

const buildNestedError = (
   path: (string | number)[],
   message: string,
   simplified: SimplifiedErrors = {}
): SimplifiedErrors => {
   const [head, ...tail] = path;

   simplified[head] =
      tail.length === 0
         ? message
         : buildNestedError(
              tail,
              message,
              simplified[head] || initialize(tail[0])
           );
   return simplified;
};

export const simplifyJoiError = (error: ValidationError): SimplifiedErrors => {
   return error?.details.reduce(
      (simplified: SimplifiedErrors, detail: ValidationErrorItem) => {
         return buildNestedError(detail.path, detail.message, simplified);
      },
      initialize(error?.details[0].path[0])
   );
};
