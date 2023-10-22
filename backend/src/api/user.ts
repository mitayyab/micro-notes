import { Handler, Request, Response, NextFunction } from 'express';
import { validate as userValidator } from '@lib/user/user.validator';
import { User, UserModel } from '@lib/user/user.model';
import { validateUsing } from '@lib/validator/joi.middleware';

const registerNewUser: Handler = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   const inputUser: User = req.body;

   try {
      const user: User = await UserModel.create({
         ...inputUser,
         isAdmin: false,
         email: inputUser.email.toLowerCase(),
      });

      res.json(user.toTransferableObject());
   } catch (e) {
      next(e);
   }
};

export const post: Handler[] = [validateUsing(userValidator), registerNewUser];
