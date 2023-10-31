import app from 'server';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import {
   currentCookie,
   get,
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
import { Response } from 'supertest';

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
                  _id: expect.any(String),
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
                              selected: false,
                              text: 'nothing',
                           },
                        ],
                        text: 'what am I doing',
                     },
                  ],
                  title: 'something',
                  topics: ['test'],
               },
               score: 1,
               user: expect.any(String),
            });
         } finally {
            await ResultModel.findByIdAndDelete(res.body._id);
         }
      });

      it('should overwrite the old result with latest one if inputs are valid', async () => {
         const oldValidResult = {
            quizId: quiz._id,
            attemptedQuestions: ['testing'],
         };

         let res = await post(app, '/results', oldValidResult, currentCookie());

         try {
            const newValidResult = {
               quizId: quiz._id,
               attemptedQuestions: ['nothing'],
            };

            res = await post(app, '/results', newValidResult, currentCookie());

            expect(res.statusCode).toEqual(200);

            expect(res.body).toEqual({
               _id: expect.any(String),
               quiz: {
                  _id: expect.any(String),
                  level: 'BEGINNER',
                  questions: [
                     {
                        _id: expect.any(String),
                        answerChoices: [
                           {
                              _id: expect.any(String),
                              correct: true,
                              selected: false,
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
               score: 0,
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

describe('GET Request on /results', () => {
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
      let resultResponse: Response;

      beforeAll(async () => {
         const { email, password } = testUser;
         await createUser({ ...testUser });
         await login(app, { email, password });

         quiz = await QuizModel.create(validQuiz);

         const validResult = {
            quizId: quiz._id,
            attemptedQuestions: ['testing'],
         };

         resultResponse = await post(
            app,
            '/results',
            validResult,
            currentCookie(),
         );
      });

      it('should return all results of logged-in User', async () => {
         const res = await get(app, '/results', currentCookie());

         expect(res.statusCode).toEqual(200);

         expect(res.body).toEqual([
            { score: 1, title: 'something', topics: ['test'], total: 1 },
         ]);
      });

      afterAll(async () => {
         await ResultModel.findByIdAndDelete(resultResponse.body._id);

         await QuizModel.findByIdAndDelete(quiz._id);

         await logoutAndDeleteUser(app);
      });
   });
});
