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
import { createUser } from '@lib/user/user.testutils';
import { User } from '@lib/user/user.model';
import { Quiz, QuizModel } from '@lib/quiz/quiz.model';

describe.only('POST Request on /results', () => {
   it('should NOT allow access if user is NOT logged in', async () => {
      const res = await post(app, '/results', {});

      expect(res.statusCode).toEqual(401);

      expect(res.body).toEqual({
         message: 'User needs to login.',
         type: ErrorType.UNAUTHORIZED,
      });
   });

   describe('User logged-in', () => {
      let user: User;
      let quiz: Quiz;

      beforeAll(async () => {
         const { email, password } = testUser;
         user = await createUser({ ...testUser });
         await login(app, { email, password });

         quiz = await QuizModel.create(validQuiz);
      });

      it('should NOT create a new result if inputs are NOT valid (empty)', async () => {
         const invalidResult = {
            user: '',

            quiz: '',

            answers: [
               {
                  questionNumber: 0,
                  selectedChoice: '',
               },
            ],
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
               answers: [
                  {
                     selectedChoice:
                        '"answers[0].selectedChoice" is not allowed to be empty',
                  },
               ],
               quiz: '"quiz" is not allowed to be empty',
               user: '"user" is not allowed to be empty',
            },
            message: 'Invalid request input',
            type: 'INVALID_INPUT',
         });
      });

      // it('should NOT create a new quiz if there are multiple questions with same text', async () => {
      //    const invalidTestQuiz = {
      //       title: 'something',
      //       topics: ['test'],
      //       level: 'BEGINNER',
      //       questions: [
      //          {
      //             text: 'what am I doing',
      //             answerChoices: [
      //                {
      //                   text: 'lets',
      //                   correct: true,
      //                },
      //                {
      //                   text: 'change',
      //                   correct: false,
      //                },
      //             ],
      //          },
      //          {
      //             text: 'what am I doing',
      //             answerChoices: [
      //                {
      //                   text: 'everything',
      //                   correct: true,
      //                },
      //                {
      //                   text: 'for now',
      //                   correct: false,
      //                },
      //             ],
      //          },
      //       ],
      //    };

      //    const res = await post(
      //       app,
      //       '/quizes',
      //       invalidTestQuiz,
      //       currentCookie(),
      //    );

      //    expect(res.statusCode).toEqual(409);
      //    expect(res.body).toEqual({
      //       field: {
      //          'questions.text': 'what am I doing',
      //          title: 'something',
      //       },
      //       message: 'Record with same field already exists',
      //       type: ErrorType.UNIQUE_FIELD_VIOLATION,
      //    });
      // });

      // it('should NOT create a new quiz if there are multiple answers within a question with same text', async () => {
      //    const invalidTestQuiz = {
      //       title: 'something',
      //       topics: ['test'],
      //       level: 'BEGINNER',
      //       questions: [
      //          {
      //             text: 'what am I doing',
      //             answerChoices: [
      //                {
      //                   text: 'testing',
      //                   correct: true,
      //                },
      //                {
      //                   text: 'nothing',
      //                   correct: false,
      //                },
      //                {
      //                   text: 'testing',
      //                   correct: false,
      //                },
      //             ],
      //          },
      //       ],
      //    };

      //    const res = await post(
      //       app,
      //       '/quizes',
      //       invalidTestQuiz,
      //       currentCookie(),
      //    );

      //    expect(res.statusCode).toEqual(409);

      //    expect(res.body).toEqual({
      //       field: {
      //          'questions.answerChoices.text': 'testing',
      //          'questions.text': 'what am I doing',
      //       },
      //       message: 'Record with same field already exists',
      //       type: ErrorType.UNIQUE_FIELD_VIOLATION,
      //    });
      // });

      // it('should NOT create a new quiz if there are less than 2 answer options within a question', async () => {
      //    const invalidTestQuiz = {
      //       title: 'something',
      //       topics: ['test'],
      //       level: 'BEGINNER',
      //       questions: [
      //          {
      //             text: 'what am I doing',
      //             answerChoices: [
      //                {
      //                   text: 'testing',
      //                   correct: true,
      //                },
      //             ],
      //          },
      //       ],
      //    };

      //    const res = await post(
      //       app,
      //       '/quizes',
      //       invalidTestQuiz,
      //       currentCookie(),
      //    );

      //    expect(res.statusCode).toEqual(400);

      //    expect(res.body).toEqual({
      //       errors: {
      //          questions: [
      //             {
      //                answerChoices:
      //                   '"questions[0].answerChoices" must contain at least 2 items',
      //             },
      //          ],
      //       },
      //       message: 'Invalid request input',
      //       type: 'INVALID_INPUT',
      //    });
      // });

      it('should create a new result if inputs are valid', async () => {
         const invalidResult = {
            user: user.id,

            quiz: quiz.id,

            answers: [
               {
                  questionNumber: 1,
                  selectedChoice: 'a',
               },
               {
                  questionNumber: 2,
                  selectedChoice: 'b',
               },
            ],
         };

         const res = await post(
            app,
            '/results',
            invalidResult,
            currentCookie(),
         );

         expect(res.statusCode).toEqual(200);

         expect(res.body).toEqual({
            __v: 0,
            _id: '65382ae80a868d4e5edb67d5',
            answers: [
               {
                  _id: '65382ae80a868d4e5edb67d6',
                  questionNumber: 1,
                  selectedChoice: 'a',
               },
               {
                  _id: '65382ae80a868d4e5edb67d7',
                  questionNumber: 2,
                  selectedChoice: 'b',
               },
            ],
            quiz: '65382ae80a868d4e5edb67ce',
            user: '65382ae80a868d4e5edb67c8',
         });
      });

      afterAll(async () => {
         await logoutAndDeleteUser(app);
      });
   });
});
