import { Handler, Request, Response } from 'express';
import { tryAndCatch } from '@lib/middleware';
import {
   ensureAdmin,
   ensureAuthenticated,
} from '@lib/session/session.middleware';
import { QuizModel } from '@lib/quiz/quiz.model';
import { validateUsing } from '@lib/validator/joi.middleware';
import { updateQuizValidate } from '@lib/quiz/quiz.validator';

const getQuiz: Handler = async (req: Request, res: Response) => {
   const specificQuiz = await QuizModel.findById(req.params.id)
      .select('-__v')
      .lean();

   res.status(200).json(specificQuiz);
};

const updateQuiz: Handler = async (req: Request, res: Response) => {
   const updatedQuiz = await QuizModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
         new: true,
         select: '-__v',
         lean: true,
      },
   );

   res.status(200).json(updatedQuiz);
};

export const get: Handler[] = [ensureAuthenticated, tryAndCatch(getQuiz)];

export const put: Handler[] = [
   ensureAdmin,
   validateUsing(updateQuizValidate),
   tryAndCatch(updateQuiz),
];
