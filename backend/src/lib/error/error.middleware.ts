import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';

import { ApiError, Type } from '@lib/error/ApiError';
import { DuplicateError } from '@lib/error/DuplicateError';
import { NotFoundError } from '@lib/error/NotFoundError';

const httpErrors = mapErrorTypeToHttpCodes();

function mapErrorTypeToHttpCodes() {
   const mapping = {};

   mapping[Type.INVALID_INPUT] = 400;
   mapping[Type.UNAUTHORIZED] = 401;
   mapping[Type.FORBIDDEN] = 403;
   mapping[Type.NOT_FOUND] = 404;
   mapping[Type.UNIQUE_FIELD_VIOLATION] = 409;

   return mapping;
}

export const mongoDatabaseErrorHandler: ErrorRequestHandler = async (
   error: MongoServerError,
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   if (error.name === 'MongoServerError') {
      switch (error.code) {
         case 11000:
            next(new DuplicateError(error.keyValue));
            break;

         default:
            console.log(
               `MongoServerError with code ${error.code} not handled`,
               error,
            );
            next(error);
      }
   } else if (error.name === 'CastError') {
      next(new NotFoundError(error.value));
   } else {
      next(error);
   }
};

export const apiErrorHandler: ErrorRequestHandler = async (
   error: ApiError,
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   const status = httpErrors[error.type] || 500;

   return res.status(status).json(error);
};
