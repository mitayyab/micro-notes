import { Handler, Request, Response, NextFunction } from 'express';

export const tryAndCatch =
   (handler: Handler): Handler =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         await handler(req, res, next);
      } catch (e) {
         next(e);
      }
   };
