import passport, { AuthorizeCallback } from 'passport';
import { Handler, Request, Response, NextFunction } from 'express';

import { User } from '@lib/user/user.model';
import { validateUsing } from '@lib/validator/joi.middleware';
import { validate as credentialsValidator } from '@lib/session/credentials.validator';
import { ensureAuthenticated } from '@lib/session/session.middleware';

const login: Handler = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   const authHandler: AuthorizeCallback = (err, user: User) => {
      if (err) {
         return next(err);
      }

      if (user) {
         req.login(user, err => {
            if (err) {
               return next(err);
            }
            return res.json(user.toTransferableObject());
         });
      } else {
         return res.status(401).json({ message: 'Authentication failed' });
      }
   };

   passport.authenticate('local', authHandler)(req, res, next);
};

const logout: Handler = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   req.logout(err => next(err));
   res.json({ message: 'Logged out' });
};

export const post: Handler[] = [validateUsing(credentialsValidator), login];
export const del: Handler[] = [ensureAuthenticated, logout];
