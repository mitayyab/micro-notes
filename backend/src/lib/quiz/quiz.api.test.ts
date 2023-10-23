import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import {
   createUserAndLogin,
   currentCookie,
   getExpectedQuiz,
   get,
   logoutAndDeleteUser,
   post,
   put,
   validQuiz,
} from '@lib/test/utils';
import app from 'server';
import { Type as ErrorType } from '@lib/error/ApiError';
import { Quiz, QuizModel } from './quiz.model';

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
               level: 'BEGINNER',
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
               level: 'BEGINNER',
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

         it('should NOT create a new quiz if there are less than 2 answer options within a question', async () => {
            const invalidTestQuiz = {
               title: 'something',
               topics: ['test'],
               level: 'BEGINNER',
               questions: [
                  {
                     text: 'what am I doing',
                     answerChoices: [
                        {
                           text: 'testing',
                           correct: true,
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
                  questions: [
                     {
                        answerChoices:
                           '"questions[0].answerChoices" must contain at least 2 items',
                     },
                  ],
               },
               message: 'Invalid request input',
               type: 'INVALID_INPUT',
            });
         });

         it('should create a new quiz if user is Admin and inputs are valid', async () => {
            const validTestQuiz = {
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
                  level: 'BEGINNER',
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

   describe('GET Request on /quizes/search/:searchString', () => {
      let testQuiz1: Quiz, testQuiz2: Quiz;

      beforeAll(async () => {
         const validTestQuiz1 = {
            title: 'something',
            topics: ['test'],
            level: 'BEGINNER',
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

         const validTestQuiz2 = {
            title: 'anything',
            topics: ['alternate test'],
            level: 'BEGINNER',
            questions: [
               {
                  text: 'what are you doing',
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

         testQuiz1 = await QuizModel.create(validTestQuiz1);

         testQuiz2 = await QuizModel.create(validTestQuiz2);
      });

      it('should return an empty array of quizes when something is not there', async () => {
         const res = await get(app, '/quizes/search/xyz');

         expect(res.statusCode).toEqual(200);
         expect(res.body).toEqual([]);
      });

      it('should return an array of quizes based on a title as searchString ', async () => {
         const res = await get(app, '/quizes/search/something');

         expect(res.statusCode).toEqual(200);
         expect(res.body).toEqual([
            {
               _id: expect.any(String),
               numberOfQuestions: 1,
               title: 'something',
               topics: ['test'],
            },
         ]);
      });

      it('should return an array of quizes based on a topics as searchString', async () => {
         const res = await get(app, '/quizes/search/test');

         expect(res.statusCode).toEqual(200);
         expect(res.body).toEqual([
            {
               _id: expect.any(String),
               numberOfQuestions: 1,
               title: 'something',
               topics: ['test'],
            },
            {
               _id: expect.any(String),
               numberOfQuestions: 1,
               title: 'anything',
               topics: ['alternate test'],
            },
         ]);
      });

      afterAll(async () => {
         await QuizModel.findByIdAndDelete(testQuiz1._id);

         await QuizModel.findByIdAndDelete(testQuiz2._id);
      });
   });

   describe('GET Request on /quizes/:ID', () => {
      let testQuiz: Quiz;

      beforeAll(async () => {
         await createUserAndLogin(app);

         const validTestQuiz = {
            title: 'something',
            topics: ['test'],
            level: 'BEGINNER',
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

         testQuiz = await QuizModel.create(validTestQuiz);
      });

      it('should return error 404 when in-valid quizID is passed', async () => {
         const link = '/quizes/test';

         const res = await get(app, link, currentCookie());

         expect(res.statusCode).toEqual(404);
         expect(res.body).toEqual({
            id: 'test',
            message: 'Record with this id does not exist',
            type: 'NOT_FOUND',
         });
      });

      it('should return a quiz when valid quizID is passed', async () => {
         const link = '/quizes/' + testQuiz._id;

         const res = await get(app, link, currentCookie());

         expect(res.statusCode).toEqual(200);
         expect(res.body).toEqual({
            _id: expect.any(String),
            title: 'something',
            topics: ['test'],
            level: 'BEGINNER',
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
      });

      afterAll(async () => {
         await QuizModel.findByIdAndDelete(testQuiz._id);

         await logoutAndDeleteUser(app);
      });
   });

   describe('PUT request on quizes/:ID', () => {
      let testQuiz: Quiz;

      it('should NOT update a quiz if user is NOT Admin', async () => {
         testQuiz = await QuizModel.create(validQuiz);

         let link = '/quizes/' + testQuiz._id;

         const res = await put(app, link, {});

         expect(res.statusCode).toEqual(401);

         expect(res.body).toEqual({
            message: 'User needs to login.',
            type: 'UNAUTHORIZED',
         });

         await QuizModel.findByIdAndDelete(testQuiz._id);
      });

      describe('user logged in as Admin', () => {
         beforeAll(async () => {
            await createUserAndLogin(app, true);
         });

         describe('invalid inputs on which PUT request fails to work', () => {
            beforeAll(async () => {
               testQuiz = await QuizModel.create(validQuiz);
            });

            it('should return INPUT ERROR : 400 when data which does not match the schema defined data-type is passed', async () => {
               let link = '/quizes/' + testQuiz._id;

               const res = await put(
                  app,
                  link,
                  {
                     title: 1,
                  },
                  currentCookie(),
               );

               expect(res.statusCode).toEqual(400);

               expect(res.body).toEqual({
                  errors: {
                     title: '"title" must be a string',
                  },
                  message: 'Invalid request input',
                  type: 'INVALID_INPUT',
               });
            });

            it('should return INPUT ERROR : 400 when a question is not passed with atleast 2 answer options', async () => {
               let link = '/quizes/' + testQuiz._id;

               const res = await put(
                  app,
                  link,
                  {
                     questions: [
                        {
                           text: 'new text',
                        },
                     ],
                  },
                  currentCookie(),
               );

               expect(res.statusCode).toEqual(400);

               expect(res.body).toEqual({
                  errors: {
                     questions: [
                        {
                           answerChoices:
                              '"questions[0].answerChoices" is required',
                        },
                     ],
                  },
                  message: 'Invalid request input',
                  type: 'INVALID_INPUT',
               });
            });

            it.skip('should return INPUT ERROR : 400 when a question is not passed with text', async () => {
               let link = '/quizes/' + testQuiz._id;

               const res = await put(
                  app,
                  link,
                  {
                     questions: [
                        {
                           answerChoices: [
                              {
                                 text: 'something',
                                 correct: false,
                              },
                              {
                                 text: 'nothing',
                                 correct: false,
                              },
                           ],
                        },
                     ],
                  },
                  currentCookie(),
               );

               expect(res.statusCode).toEqual(400);

               expect(res.body).toEqual({
                  errors: {
                     questions: [
                        {
                           text: '"questions[0].text" is required',
                        },
                     ],
                  },
                  message: 'Invalid request input',
                  type: 'INVALID_INPUT',
               });
            });

            it('should return NOT FOUND : error 404 when in-valid quizID is passed', async () => {
               const res = await put(app, '/quizes/test', {}, currentCookie());

               expect(res.statusCode).toEqual(404);

               expect(res.body).toEqual({
                  id: 'test',
                  message: 'Record with this id does not exist',
                  type: 'NOT_FOUND',
               });
            });

            afterAll(async () => {
               await QuizModel.findByIdAndDelete(testQuiz._id);
            });
         });

         describe('valid inputs on which PUT request works', () => {
            beforeEach(async () => {
               testQuiz = await QuizModel.create(validQuiz);
            });

            it('should return the updated quiz when scalar(title/level) data is passed', async () => {
               let link = '/quizes/' + testQuiz._id;

               const res = await put(
                  app,
                  link,
                  {
                     title: 'new title',
                  },
                  currentCookie(),
               );

               expect(res.statusCode).toEqual(200);

               expect(res.body).toEqual({
                  _id: expect.any(String),
                  title: 'new title',
                  topics: ['test'],
                  level: 'BEGINNER',
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
            });

            it('should return the updated quiz when complete collection(topics/questions) is passed', async () => {
               let link = '/quizes/' + testQuiz._id;

               const res = await put(
                  app,
                  link,
                  {
                     topics: ['test1', 'test2'],
                  },
                  currentCookie(),
               );

               expect(res.statusCode).toEqual(200);

               expect(res.body).toEqual({
                  _id: expect.any(String),
                  title: 'something',
                  topics: ['test1', 'test2'],
                  level: 'BEGINNER',
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
            });

            it('should return the updated quiz when scalar-data(title/level) and complete-collection(topics/questions) are passed', async () => {
               let link = '/quizes/' + testQuiz._id;

               const res = await put(
                  app,
                  link,
                  {
                     title: 'new title',
                     topics: ['test1', 'test2'],
                  },
                  currentCookie(),
               );

               expect(res.statusCode).toEqual(200);

               expect(res.body).toEqual({
                  _id: expect.any(String),
                  title: 'new title',
                  topics: ['test1', 'test2'],
                  level: 'BEGINNER',
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
            });

            afterEach(async () => {
               await QuizModel.findByIdAndDelete(testQuiz._id);
            });
         });

         afterAll(async () => {
            await logoutAndDeleteUser(app);
         });
      });
   });

   describe('PUT request on quizes/:ID/questions/:questionID', () => {
      let testQuiz: Quiz;

      it('should NOT update a quiz if user is NOT Admin', async () => {
         testQuiz = await QuizModel.create(validQuiz);

         let link =
            '/quizes/' +
            testQuiz._id +
            '/questions/' +
            testQuiz.questions[0]._id;

         try {
            const res = await put(app, link, {});

            expect(res.statusCode).toEqual(401);

            expect(res.body).toEqual({
               message: 'User needs to login.',
               type: 'UNAUTHORIZED',
            });
         } finally {
            await QuizModel.findByIdAndDelete(testQuiz._id);
         }
      });

      describe('user logged in as Admin', () => {
         beforeAll(async () => {
            await createUserAndLogin(app, true);

            const validQuiz = {
               title: 'something',
               topics: ['test'],
               level: 'BEGINNER',
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
                  {
                     text: 'what are you doing',
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

            testQuiz = await QuizModel.create(validQuiz);
         });

         describe('invalid inputs on which PUT request does not works', () => {
            it('should return INPUT ERROR : 400 when a question is not passed with text', async () => {
               let link =
                  '/quizes/' +
                  testQuiz._id +
                  '/questions/' +
                  testQuiz.questions[0]._id;

               const res = await put(
                  app,
                  link,
                  {
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
                  currentCookie(),
               );

               let expectUpdatedQuiz = getExpectedQuiz();
               expectUpdatedQuiz.questions[0].text = 'what are you doing';

               expect(res.statusCode).toEqual(400);

               expect(res.body).toEqual({
                  errors: {
                     text: '"text" is required',
                  },
                  type: 'INVALID_INPUT',
               });
            });

            it('should return INPUT ERROR : 400 when a question is not passed with atleast 2 answer choices', async () => {
               let link =
                  '/quizes/' +
                  testQuiz._id +
                  '/questions/' +
                  testQuiz.questions[0]._id;

               const res = await put(
                  app,
                  link,
                  {
                     text: 'what are you doing',
                     answerChoices: [
                        {
                           text: 'testing',
                           correct: true,
                        },
                     ],
                  },
                  currentCookie(),
               );

               let expectUpdatedQuiz = getExpectedQuiz();
               expectUpdatedQuiz.questions[0].text = 'what are you doing';

               expect(res.statusCode).toEqual(400);

               expect(res.body).toEqual({
                  errors: {
                     answerChoices:
                        '"answerChoices" must contain at least 2 items',
                  },
                  type: 'INVALID_INPUT',
               });
            });
         });

         describe('valid inputs on which PUT request works', () => {
            it('should return the updated quiz when a valid question is passed', async () => {
               let link =
                  '/quizes/' +
                  testQuiz._id +
                  '/questions/' +
                  testQuiz.questions[0]._id;

               const res = await put(
                  app,
                  link,
                  {
                     text: 'new what are you doing',
                     answerChoices: [
                        {
                           text: 'new testing',
                           correct: true,
                        },
                        {
                           text: 'new nothing',
                           correct: false,
                        },
                     ],
                  },
                  currentCookie(),
               );

               let expectUpdatedQuiz = getExpectedQuiz();
               expectUpdatedQuiz.questions[0].text = 'new what are you doing';
               expectUpdatedQuiz.questions[0].answerChoices[0].text =
                  'new testing';
               expectUpdatedQuiz.questions[0].answerChoices[1].text =
                  'new nothing';
               expectUpdatedQuiz.questions.push({
                  _id: expect.any(String),
                  text: 'what are you doing',
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
               });

               expect(res.statusCode).toEqual(200);

               expect(res.body).toEqual(expectUpdatedQuiz);
            });
         });

         afterAll(async () => {
            await QuizModel.findByIdAndDelete(testQuiz._id);
            await logoutAndDeleteUser(app);
         });
      });
   });
});
