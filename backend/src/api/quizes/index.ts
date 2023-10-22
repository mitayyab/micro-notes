import { Handler, Request, Response } from 'express';

import { ensureAdmin } from '@lib/session/session.middleware';
import { tryAndCatch } from '@lib/middleware';
import { Quiz, QuizModel } from '@lib/quiz/quiz.model';
import { validateUsing } from '@lib/validator/joi.middleware';
import { validate as quizValidator } from '@lib/quiz/quiz.validator';

const createQuiz: Handler = async (req: Request, res: Response) => {
   const inputQuiz: Quiz = req.body;

   const quiz: Quiz = (
      await QuizModel.create({
         ...inputQuiz,
         title: inputQuiz.title.toLowerCase(),
         topics: inputQuiz.topics.map(topic => topic.toLowerCase()),
      })
   ).toObject({
      versionKey: false,
   });

   res.json(quiz);
};

export const post: Handler[] = [
   ensureAdmin,
   validateUsing(quizValidator),
   tryAndCatch(createQuiz),
];
