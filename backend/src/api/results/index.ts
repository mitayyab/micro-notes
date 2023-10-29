import { Handler, Request, Response } from 'express';

import { ensureAuthenticated } from '@lib/session/session.middleware';
import { validateUsing } from '@lib/validator/joi.middleware';
import { createResultValidate } from '@lib/result/result.validator';
import { tryAndCatch } from '@lib/middleware';
import { Result, ResultModel } from '@lib/result/result.model';
import { User } from '@lib/user/user.model';

const createResult: Handler = async (req: Request, res: Response) => {
   console.log('req.user = ', req.user);
   console.log('req.body = ', req.body);
   console.log('req.body.quiz.questions = ', req.body.questions);
   const solvedQuiz = req.body;

   const result: Result = await ResultModel.create({
      user: (req.user as User)._id,
      quiz: {
         ...solvedQuiz,
         title: solvedQuiz.title.toLowerCase(),
         topics: solvedQuiz.topics.map(topic => topic.toLowerCase()),
      },
   });

   res.status(200).json(result);
};

export const post: Handler[] = [
   ensureAuthenticated,
   validateUsing(createResultValidate),
   tryAndCatch(createResult),
];
