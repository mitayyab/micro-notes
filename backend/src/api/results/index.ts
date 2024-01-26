import { Handler, Request, Response } from 'express';

import { ensureAuthenticated } from '@lib/session/session.middleware';
import { validateUsing } from '@lib/validator/joi.middleware';
import { createResultValidate } from '@lib/result/result.validator';
import { tryAndCatch } from '@lib/middleware';
import {
   // Result,
   ResultModel,
   attemptedQuestion,
   attemptedQuiz,
} from '@lib/result/result.model';
import { User } from '@lib/user/user.model';
import { Quiz, QuizModel } from '@lib/quiz/quiz.model';

const createResult: Handler = async (req: Request, res: Response) => {
   let attemptedQuiz: Quiz = await QuizModel.findById(
      req.body.quizId,
   ).setOptions({
      lean: true,
   });

   const selectedAnswerChoices = req.body.attemptedQuestions;

   let score = 0;

   attemptedQuiz.questions = attemptedQuiz.questions.map((question, index) => {
      question.answerChoices = question.answerChoices.map(answerChoice => {
         if (answerChoice.text === selectedAnswerChoices[index]) {
            if (answerChoice.correct === true) {
               score++;
            }
            return Object.assign({ selected: true }, answerChoice);
         } else {
            return Object.assign({ selected: false }, answerChoice);
         }
      });

      return question;
   });

   // const result: Result = (
   //    await ResultModel.create({
   //       user: (req.user as User)._id,
   //       quiz: attemptedQuiz,
   //       score: score,
   //    })
   // ).toObject({
   //    versionKey: false,
   // });

   // res.status(200).json(result);

   const result: { user: User; quiz: attemptedQuiz; score: number } = {
      user: (req.user as User)._id,
      quiz: attemptedQuiz as attemptedQuiz,
      score: score,
   };

   const storedResult = await ResultModel.findOneAndUpdate(
      { 'quiz._id': req.body._id, user: (req.user as User)._id },
      result,
      {
         overwrite: true,
         upsert: true,
         new: true,
         lean: true,
         projection: { __v: 0 },
      },
   );

   res.status(200).json(storedResult);
};

const getSummarizedResults = async (req: Request, res: Response) => {
   const rawResults: {
      quiz: { title: string; topics: [string]; questions: attemptedQuestion[] };
      score: number;
   }[] = await ResultModel.find(
      { user: (req.user as User)._id },
      { 'quiz.title': 1, 'quiz.topics': 1, 'quiz.questions': 1, score: 1 },
   ).lean();

   const summarizedResults: {
      title: string;
      topics: [string];
      total: number;
      score: number;
   }[] = rawResults.map(result => {
      return {
         title: result.quiz.title,
         topics: result.quiz.topics,
         total: result.quiz.questions.length,
         score: result.score,
      };
   });

   res.status(200).json(summarizedResults);
};

export const post: Handler[] = [
   ensureAuthenticated,
   validateUsing(createResultValidate),
   tryAndCatch(createResult),
];

export const get: Handler[] = [
   ensureAuthenticated,
   tryAndCatch(getSummarizedResults),
];
