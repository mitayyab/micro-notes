import app from 'server';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import {
   currentCookie,
   login,
   logoutAndDeleteUser,
   post,
   testUser,
   // validQuiz,
} from '@lib/test/utils';
import { Type as ErrorType } from '@lib/error/ApiError';
import { createUser } from '@lib/user/user.testutils';
// import { User } from '@lib/user/user.model';
// import { Quiz } from '@lib/quiz/quiz.model';

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
      // let user: User;
      // let quiz: Quiz;

      beforeAll(async () => {
         const { email, password } = testUser;
         // user = await createUser({ ...testUser });
         await createUser({ ...testUser });
         await login(app, { email, password });

         // quiz = await QuizModel.create(validQuiz);
      });

      it('should NOT create a new result if inputs are NOT valid (empty)', async () => {
         const invalidResult = {
            quiz: {
               title: '',
               topics: [],
               level: '',
               questions: [
                  {
                     text: '',
                     answerChoices: [
                        {
                           text: '',
                        },
                        {
                           text: '',
                        },
                     ],
                  },
               ],
            },
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
               quiz: {
                  level: '"quiz.level" is not allowed to be empty',
                  questions: [
                     {
                        answerChoices: [
                           {
                              correct:
                                 '"quiz.questions[0].answerChoices[0].correct" is required',
                              selected:
                                 '"quiz.questions[0].answerChoices[0].selected" is required',
                              text: '"quiz.questions[0].answerChoices[0].text" is not allowed to be empty',
                           },
                           {
                              correct:
                                 '"quiz.questions[0].answerChoices[1].correct" is required',
                              selected:
                                 '"quiz.questions[0].answerChoices[1].selected" is required',
                              text: '"quiz.questions[0].answerChoices[1].text" is not allowed to be empty',
                           },
                        ],
                        text: '"quiz.questions[0].text" is not allowed to be empty',
                     },
                  ],
                  title: '"quiz.title" is not allowed to be empty',
                  topics: '"quiz.topics" must contain at least 1 items',
               },
            },
            message: 'Invalid request input',
            type: 'INVALID_INPUT',
         });
      });

      it('should create a new result if inputs are valid', async () => {
         const validResult = {
            quiz: {
               title: 'something',
               topics: ['test1', 'TEST2'],
               level: 'BEGINNER',
               questions: [
                  {
                     text: 'what am I doing',
                     answerChoices: [
                        {
                           text: 'testing',
                           correct: true,
                           selected: true,
                        },
                        {
                           text: 'nothing',
                           correct: false,
                           selected: false,
                        },
                     ],
                  },
               ],
            },
         };

         const res = await post(app, '/results', validResult, currentCookie());

         expect(res.statusCode).toEqual(400);

         expect(res.body).toEqual({});
      });

      afterAll(async () => {
         await logoutAndDeleteUser(app);
      });
   });
});
