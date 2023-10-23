import { Handler, Request, Response } from 'express';

import { tryAndCatch } from '@lib/middleware';
import { ensureAuthenticated } from '@lib/session/session.middleware';
import { QuizModel } from '@lib/quiz/quiz.model';

const getQuiz: Handler = async (req: Request, res: Response) => {
   const specificQuiz = await QuizModel.findById(req.params.id)
      .select('-__v')
      .lean();

   res.status(200).json(specificQuiz);
};

export const get: Handler[] = [ensureAuthenticated, tryAndCatch(getQuiz)];
