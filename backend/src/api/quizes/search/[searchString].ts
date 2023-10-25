import { Handler, Request, Response } from 'express';

import { tryAndCatch } from '@lib/middleware';
import { Quiz, QuizModel } from '@lib/quiz/quiz.model';

const searchSummarizedQuizes: Handler = async (req: Request, res: Response) => {
   let searchString = req.params.searchString.toLowerCase();

   searchString = searchString.trim();

   searchString = searchString.replace(/\s+/g, '|');

   const searchRegex = new RegExp(searchString, 'i');

   const searchedQuizzes: Quiz[] = await QuizModel.find({
      $or: [
         { title: { $regex: searchRegex } },
         { topics: { $regex: searchRegex } },
      ],
   })
      .select({
         numberOfQuestions: { $size: '$questions' },
         title: 1,
         topics: 1,
      })
      .lean();

   res.status(200).json(searchedQuizzes);
};
export const get: Handler[] = [tryAndCatch(searchSummarizedQuizes)];
