import { Handler, Request, Response } from 'express';

import { ensureAuthenticated } from '@lib/session/session.middleware';
import { validateUsing } from '@lib/validator/joi.middleware';
import { createResultValidate } from '@lib/result/result.validator';
import { tryAndCatch } from '@lib/middleware';
import { Result, ResultModel } from '@lib/result/result.model';
import { User } from '@lib/user/user.model';
import { Quiz, QuizModel } from '@lib/quiz/quiz.model';

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
   let attemptedQuiz: Quiz = await QuizModel.findById(
      req.body.quizId,
   ).setOptions({
      lean: true,
   });

   const selectedAnswerChoices = req.body.attemptedQuestions;

   attemptedQuiz.questions = attemptedQuiz.questions.map((question, index) => {
      question.answerChoices = question.answerChoices.map(answerChoice => {
         if (answerChoice.text === selectedAnswerChoices[index]) {
            return Object.assign({ selected: true }, answerChoice);
         } else {
            return Object.assign({ selected: true }, answerChoice);
         }
      });

      return question;
   });

   const result: Result = (
      await ResultModel.create({
         user: (req.user as User)._id,
         quiz: attemptedQuiz,
      })
   ).toObject({
      versionKey: false,
   });

   res.status(200).json(result);
};

export const post: Handler[] = [
   ensureAuthenticated,
   validateUsing(createResultValidate),
   tryAndCatch(createResult),
];
