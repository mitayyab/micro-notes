import { RequestHandler, Request, Response, NextFunction } from 'express';

import { ApiError, Type } from '@lib/error/ApiError';
import { User } from '@lib/user/user.model';

export const ensureAuthenticated: RequestHandler = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   if (req.isAuthenticated()) {
      return next();
   } else {
      next(new ApiError(Type.UNAUTHORIZED, 'User needs to login.'));
   }
};

export const ensureAdmin: RequestHandler = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   if (req.isAuthenticated() && (<User>req.user).isAdmin) {
      return next();
   } else {
      next(
         req.isAuthenticated()
            ? new ApiError(Type.FORBIDDEN, 'User is not authorized')
            : new ApiError(Type.UNAUTHORIZED, 'User needs to login.'),
      );
   }
};
