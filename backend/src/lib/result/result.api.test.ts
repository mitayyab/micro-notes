import app from 'server';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import {
   currentCookie,
   login,
   logoutAndDeleteUser,
   post,
   testUser,
   validQuiz,
} from '@lib/test/utils';
import { Type as ErrorType } from '@lib/error/ApiError';
import { ResultModel } from './result.model';
import { createUser } from '@lib/user/user.testutils';
import { Quiz, QuizModel } from '@lib/quiz/quiz.model';

describe('POST Request on /results', () => {
   it('should NOT allow access if user is NOT logged in', async () => {
      const res = await post(app, '/results', {});

      expect(res.statusCode).toEqual(401);

      expect(res.body).toEqual({
         message: 'User needs to login.',
         type: ErrorType.UNAUTHORIZED,
      });
   });

   describe('User logged-in', () => {
      let quiz: Quiz;

      beforeAll(async () => {
         const { email, password } = testUser;
         await createUser({ ...testUser });
         await login(app, { email, password });

         quiz = await QuizModel.create(validQuiz);
      });

      it('should NOT create a new result if invalid quizId is passed', async () => {
         const invalidResult = {
            quizId: 'test',
            attemptedQuestions: ['testing'],
         };

         const res = await post(
            app,
            '/results',
            invalidResult,
            currentCookie(),
         );

         expect(res.statusCode).toEqual(404);

         expect(res.body).toEqual({
            id: 'test',
            message: 'Record with this id does not exist',
            type: 'NOT_FOUND',
         });
      });

      it('should NOT create a new result if no question is solved are NOT valid (empty)', async () => {
         const invalidResult = {
            quizId: quiz._id,
            attemptedQuestions: [],
         };

         const res = await post(
            app,
            '/results',
            invalidResult,
            currentCookie(),
         );

         expect(res.statusCode).toEqual(400);

         expect(res.body).toEqual({
            errors: {
               attemptedQuestions:
                  '"attemptedQuestions" must contain at least 1 items',
            },
            message: 'Invalid request input',
            type: 'INVALID_INPUT',
         });
      });

      it('should create a new result if inputs are valid', async () => {
         const validResult = {
            quizId: quiz._id,
            attemptedQuestions: ['testing'],
         };

         const res = await post(app, '/results', validResult, currentCookie());
         try {
            expect(res.statusCode).toEqual(200);

            expect(res.body).toEqual({
               _id: expect.any(String),
               quiz: {
                  level: 'BEGINNER',
                  questions: [
                     {
                        _id: expect.any(String),
                        answerChoices: [
                           {
                              _id: expect.any(String),
                              correct: true,
                              selected: true,
                              text: 'testing',
                           },
                           {
                              _id: expect.any(String),
                              correct: false,
                              selected: true,
                              text: 'nothing',
                           },
                        ],
                        text: 'what am I doing',
                     },
                  ],
                  title: 'something',
                  topics: ['test'],
               },
               user: expect.any(String),
            });
         } finally {
            await ResultModel.findByIdAndDelete(res.body._id);
         }
      });

      afterAll(async () => {
         await QuizModel.findByIdAndDelete(quiz._id);
         await logoutAndDeleteUser(app);
      });
   });
});
