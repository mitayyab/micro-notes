import app from 'server';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import {
   currentCookie,
   login,
   logoutAndDeleteUser,
   post,
   testUser,
} from '@lib/test/utils';
import { Type as ErrorType } from '@lib/error/ApiError';
import { ResultModel } from './result.model';
import { createUser } from '@lib/user/user.testutils';

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
      beforeAll(async () => {
         const { email, password } = testUser;
         await createUser({ ...testUser });
         await login(app, { email, password });

         // quiz = await QuizModel.create(validQuiz);
      });

      it('should NOT create a new result if inputs are NOT valid (empty)', async () => {
         const invalidResult = {
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
               level: '"level" is not allowed to be empty',
               questions: [
                  {
                     answerChoices: [
                        {
                           correct:
                              '"questions[0].answerChoices[0].correct" is required',
                           selected:
                              '"questions[0].answerChoices[0].selected" is required',
                           text: '"questions[0].answerChoices[0].text" is not allowed to be empty',
                        },
                        {
                           correct:
                              '"questions[0].answerChoices[1].correct" is required',
                           selected:
                              '"questions[0].answerChoices[1].selected" is required',
                           text: '"questions[0].answerChoices[1].text" is not allowed to be empty',
                        },
                     ],
                     text: '"questions[0].text" is not allowed to be empty',
                  },
               ],
               title: '"title" is not allowed to be empty',
               topics: '"topics" must contain at least 1 items',
            },
            message: 'Invalid request input',
            type: 'INVALID_INPUT',
         });
      });

      it('should create a new result if inputs are valid', async () => {
         const validResult = {
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
         };

         const res = await post(app, '/results', validResult, currentCookie());

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
                           selected: false,
                           text: 'nothing',
                        },
                     ],
                     text: 'what am I doing',
                  },
               ],
               title: 'something',
               topics: ['test1', 'test2'],
            },
            user: expect.any(String),
         });

         ResultModel.findByIdAndDelete(res.body._id);
      });

      afterAll(async () => {
         await logoutAndDeleteUser(app);
      });
   });
});

// describe('GET Request on /results', () => {
//    it('should NOT allow access if user is NOT logged in', async () => {
//       const res = await post(app, '/results', {});

//       expect(res.statusCode).toEqual(401);

//       expect(res.body).toEqual({
//          message: 'User needs to login.',
//          type: ErrorType.UNAUTHORIZED,
//       });
//    });

//    describe('User logged-in', () => {
//       // let user: User;
//       // let quiz: Quiz;

//       beforeAll(async () => {
//          const { email, password } = testUser;
//          // user = await createUser({ ...testUser });
//          await createUser({ ...testUser });
//          await login(app, { email, password });

//          // quiz = await QuizModel.create(validQuiz);
//       });

//       it('should return all results of logged-in User', async () => {
//          const res = await post(app, '/results', validResult, currentCookie());

//          expect(res.statusCode).toEqual(200);

//          expect(res.body).toEqual({
//             _id: expect.any(String),
//             quiz: {
//                level: 'BEGINNER',
//                questions: [
//                   {
//                      _id: expect.any(String),
//                      answerChoices: [
//                         {
//                            _id: expect.any(String),
//                            correct: true,
//                            selected: true,
//                            text: 'testing',
//                         },
//                         {
//                            _id: expect.any(String),
//                            correct: false,
//                            selected: false,
//                            text: 'nothing',
//                         },
//                      ],
//                      text: 'what am I doing',
//                   },
//                ],
//                title: 'something',
//                topics: ['test1', 'test2'],
//             },
//             user: expect.any(String),
//          });
//       });

//       afterAll(async () => {
//          await logoutAndDeleteUser(app);
//       });
//    });
// });
