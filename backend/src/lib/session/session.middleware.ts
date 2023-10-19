import { RequestHandler, Request, Response, NextFunction } from 'express';

import { ApiError, Type } from '@lib/error/ApiError';

export const ensureAuthenticated: RequestHandler = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   if (req.isAuthenticated()) {
      return next();
   } else {
      next(new ApiError(Type.UNAUTHORIZED, 'User needs to login.'));
   }
};
