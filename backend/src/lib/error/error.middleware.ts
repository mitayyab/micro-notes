import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { ApiError, Type } from '@lib/error/ApiError';
import { MongoServerError } from 'mongodb';
import { DuplicateError } from '@lib/error/DuplicateError';

const httpErrors = mapErrorTypeToHttpCodes();

function mapErrorTypeToHttpCodes() {
   const mapping = {};

   mapping[Type.INVALID_INPUT] = 400;
   mapping[Type.UNAUTHORIZED] = 401;
   mapping[Type.FORBIDDEN] = 403;
   mapping[Type.UNIQUE_FIELD_VOILATION] = 409;

   return mapping;
}

export const mongoDatabaseErrorHandler: ErrorRequestHandler = async (
   error: MongoServerError,
   req: Request,
   res: Response,
   next: NextFunction
) => {
   if (error.name === 'MongoServerError') {
      switch (error.code) {
         case 11000:
            next(new DuplicateError(error.keyValue));
            break;

         default:
            next(error);
      }
   } else {
      next(error);
   }
};

export const apiErrorHandler: ErrorRequestHandler = async (
   error: ApiError,
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const status = httpErrors[error.type] || 500;

   return res.status(status).json(error);
};
