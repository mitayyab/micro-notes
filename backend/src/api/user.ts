import { Handler, Request, Response } from 'express';
import { validate as userValidator } from '@lib/user/user.validator';
import { User, UserModel } from '@lib/user/user.model';
import { validateUsing } from '@lib/validator/joi.middleware';
import { tryAndCatch } from '@lib/middleware';

const registerNewUser: Handler = async (req: Request, res: Response) => {
   const inputUser: User = req.body;

   const user: User = await UserModel.create({
      ...inputUser,
      isAdmin: false,
      email: inputUser.email.toLowerCase(),
   });

   res.json(user.toTransferableObject());
};

export const post: Handler[] = [
   validateUsing(userValidator),
   tryAndCatch(registerNewUser),
];
