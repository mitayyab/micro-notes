import { RequestHandler, Request, Response, NextFunction } from 'express';
import { Validator } from '@lib/validator/joi';
import { RequestInputError } from '@lib/error/RequestInputError';

export const validateUsing = <T>(
   validateInput: Validator<T>
): RequestHandler => {
   const handler: RequestHandler = async (
      req: Request,
      res: Response,
      next: NextFunction
   ) => {
      const input: T = req.body;

      const errors = validateInput(input);

      if (errors) {
         return next(new RequestInputError(errors));
      }

      next();
   };

   return handler;
};
