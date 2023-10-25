import { Handler, Request, Response } from 'express';

import { ensureAuthenticated } from '@lib/session/session.middleware';
import { validateUsing } from '@lib/validator/joi.middleware';
import { resultValidate } from '@lib/result/result.validator';
import { tryAndCatch } from '@lib/middleware';
import { Result, ResultModel } from '@lib/result/result.model';

const createResult: Handler = async (req: Request, res: Response) => {
   const result: Result = await ResultModel.create(req.body);

   res.status(200).json(result);
};

export const post: Handler[] = [
   ensureAuthenticated,
   validateUsing(resultValidate),
   tryAndCatch(createResult),
];
