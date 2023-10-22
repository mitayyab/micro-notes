import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import {
   createUserAndLogin,
   currentCookie,
   logoutAndDeleteUser,
   post,
} from '@lib/test/utils';
import app from 'server';
import { Type as ErrorType } from '@lib/error/ApiError';
import { Level, QuizModel } from './quiz.model';

describe('/quizes', () => {
   describe('POST Request on /quizes', () => {
      it('should NOT allow access if user is NOT logged in', async () => {
         const res = await post(app, '/quizes', {});

         expect(res.statusCode).toEqual(401);

         expect(res.body).toEqual({
            message: 'User needs to login.',
            type: ErrorType.UNAUTHORIZED,
         });
      });

      it('should NOT create a new quiz if user is NOT Admin', async () => {
         await createUserAndLogin(app);

         try {
            const res = await post(app, '/quizes', {}, currentCookie());

            expect(res.statusCode).toEqual(403);

            expect(res.body).toEqual({
               message: 'User is not authorized',
               type: ErrorType.FORBIDDEN,
            });
         } finally {
            await logoutAndDeleteUser(app);
         }
      });

      describe('User logged in as Admin', () => {
         beforeAll(async () => {
            await createUserAndLogin(app, true);
         });

         it('should NOT create a new quiz if user is Admin but inputs are NOT valid (empty)', async () => {
            const invalidTestQuiz = {
               title: '',
               topics: [],
               level: '',
               questions: [
                  {
                     text: '',
                     answerChoices: [
                        {
                           text: '',
                           correct: false,
                        },
                        {
                           text: '',
                           correct: false,
                        },
                     ],
                  },
               ],
            };

            const res = await post(
               app,
               '/quizes',
               invalidTestQuiz,
               currentCookie(),
            );

            expect(res.statusCode).toEqual(400);

            expect(res.body).toEqual({
               errors: {
                  title: '"title" is not allowed to be empty',
                  level: '"level" is not allowed to be empty',
                  topics: '"topics" must contain at least 1 items',
                  questions: [
                     {
                        answerChoices: [
                           {
                              text: '"questions[0].answerChoices[0].text" is not allowed to be empty',
                           },
                           {
                              text: '"questions[0].answerChoices[1].text" is not allowed to be empty',
                           },
                        ],
                        text: '"questions[0].text" is not allowed to be empty',
                     },
                  ],
               },
               message: 'Invalid request input',
               type: 'INVALID_INPUT',
            });
         });

         it('should NOT create a new quiz if there are multiple questions with same text', async () => {
            const invalidTestQuiz = {
               title: 'something',
               topics: ['test'],
               level: Level.BEGINNER,
               questions: [
                  {
                     text: 'what am I doing',
                     answerChoices: [
                        {
                           text: 'lets',
                           correct: true,
                        },
                        {
                           text: 'change',
                           correct: false,
                        },
                     ],
                  },
                  {
                     text: 'what am I doing',
                     answerChoices: [
                        {
                           text: 'everything',
                           correct: true,
                        },
                        {
                           text: 'for now',
                           correct: false,
                        },
                     ],
                  },
               ],
            };

            const res = await post(
               app,
               '/quizes',
               invalidTestQuiz,
               currentCookie(),
            );

            expect(res.statusCode).toEqual(409);
            expect(res.body).toEqual({
               field: {
                  'questions.text': 'what am I doing',
                  title: 'something',
               },
               message: 'Record with same field already exists',
               type: ErrorType.UNIQUE_FIELD_VIOLATION,
            });
         });

         it('should NOT create a new quiz if there are multiple answers within a question with same text', async () => {
            const invalidTestQuiz = {
               title: 'something',
               topics: ['test'],
               level: Level.BEGINNER,
               questions: [
                  {
                     text: 'what am I doing',
                     answerChoices: [
                        {
                           text: 'testing',
                           correct: true,
                        },
                        {
                           text: 'nothing',
                           correct: false,
                        },
                        {
                           text: 'testing',
                           correct: false,
                        },
                     ],
                  },
               ],
            };

            const res = await post(
               app,
               '/quizes',
               invalidTestQuiz,
               currentCookie(),
            );

            expect(res.statusCode).toEqual(409);

            expect(res.body).toEqual({
               field: {
                  'questions.answerChoices.text': 'testing',
                  'questions.text': 'what am I doing',
               },
               message: 'Record with same field already exists',
               type: ErrorType.UNIQUE_FIELD_VIOLATION,
            });
         });

         it('should create a new quiz if user is Admin and inputs are valid', async () => {
            const validTestQuiz = {
               title: 'something',
               topics: ['test1', 'TEST2'],
               level: Level.BEGINNER,
               questions: [
                  {
                     text: 'what am I doing',
                     answerChoices: [
                        {
                           text: 'testing',
                           correct: true,
                        },
                        {
                           text: 'nothing',
                           correct: false,
                        },
                     ],
                  },
               ],
            };

            const res = await post(
               app,
               '/quizes',
               validTestQuiz,
               currentCookie(),
            );

            try {
               expect(res.statusCode).toEqual(200);

               expect(res.body).toEqual({
                  _id: expect.any(String),
                  title: 'something',
                  topics: ['test1', 'test2'],
                  level: Level.BEGINNER,
                  questions: [
                     {
                        _id: expect.any(String),
                        text: 'what am I doing',
                        answerChoices: [
                           {
                              _id: expect.any(String),
                              text: 'testing',
                              correct: true,
                           },
                           {
                              _id: expect.any(String),
                              text: 'nothing',
                              correct: false,
                           },
                        ],
                     },
                  ],
               });
            } finally {
               await QuizModel.findByIdAndDelete(res.body._id);
            }
         });

         afterAll(async () => {
            await logoutAndDeleteUser(app);
         });
      });
   });
});
