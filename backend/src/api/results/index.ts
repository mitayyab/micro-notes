import { Handler, Request, Response } from 'express';

import { ensureAuthenticated } from '@lib/session/session.middleware';
import { validateUsing } from '@lib/validator/joi.middleware';
import { createResultValidate } from '@lib/result/result.validator';
import { tryAndCatch } from '@lib/middleware';
import { Result, ResultModel } from '@lib/result/result.model';
import { User } from '@lib/user/user.model';

// const createResult: Handler = async (req: Request, res: Response) => {
//    const solvedQuiz = req.body;

//    const result: Result = (
//       await ResultModel.create({
//          user: (req.user as User)._id,
//          quiz: {
//             ...solvedQuiz,
//             title: solvedQuiz.title.toLowerCase(),
//             topics: solvedQuiz.topics.map(topic => topic.toLowerCase()),
//          },
//       })
//    ).toObject({
//       versionKey: false,
//    });

//    res.status(200).json(result);
// };
//--------------------------------------------------------------------------------
const createResult: Handler = async (req: Request, res: Response) => {
   const solvedQuiz = req.body;

   const result: Result = (
      await ResultModel.create({
         user: (req.user as User)._id,
         quiz: {
            ...solvedQuiz,
            title: solvedQuiz.title.toLowerCase(),
            topics: solvedQuiz.topics.map(topic => topic.toLowerCase()),
         },
      })
   ).toObject({
      versionKey: false,
   });

   res.status(200).json(result);
};

//--------------------------------------------------------------------------------

// const getSummarizedResults = async (req: Request, res: Response) => {
//    const summaizedResults: [{ title: string, topics: [string], total: number, correct: number }] = await ResultModel.find();
// }

export const post: Handler[] = [
   ensureAuthenticated,
   validateUsing(createResultValidate),
   tryAndCatch(createResult),
];

// export const get: Handler[] = [ensureAuthenticated, tryAndCatch(getSummarizedResults)];