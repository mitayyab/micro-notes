import { Handler, Request, Response } from 'express';

import { tryAndCatch } from '@lib/middleware';
import { QuizModel } from '@lib/quiz/quiz.model';
import { ensureAdmin } from '@lib/session/session.middleware';
import { validateUsing } from '@lib/validator/joi.middleware';
import { updateQuestionValidate } from '@lib/quiz/question/question.validator';


const updateQuestion: Handler = async (req: Request, res: Response) => {
   let updatedQuiz = await QuizModel.findOneAndUpdate(
      { 'questions._id': req.params.questionID },
      { $set: { 'questions.$': req.body } },
      { new: true, lean: true, select: '-__v' }
   );

   res.status(200).json(updatedQuiz);
};

export const put: Handler[] = [ensureAdmin, validateUsing(updateQuestionValidate), tryAndCatch(updateQuestion)];

