import request, { Response } from 'supertest';
import { Application } from 'express';
import { expect } from '@jest/globals';

import { createUser, deleteUser } from '@lib/user/user.testutils';

export const testUser = {
   firstName: 'Ibrahim',
   lastName: 'Tayyab',
   email: 'ibrahim@tayyab.dev',
   password: 'test123',
   isAdmin: false,
};

export const get = async (
   app: Application,
   path: string,
   cookie: string[] = [],
) =>
   request(app)
      .get(path)
      .set('Cookie', cookie)
      .set('Accept', 'application/json');

export const post = async (
   app: Application,
   path: string,
   body: Record<string, any>,
   cookie: string[] = [],
): Promise<Response> =>
   request(app)
      .post(path)
      .set('Cookie', cookie)
      .send(body)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

export const put = async (
   app: Application,
   path: string,
   body: object,
   cookie: string[] = [],
): Promise<Response> => request(app).put(path).set('Cookie', cookie).send(body);

export const del = async (
   app: Application,
   path: string,
   cookie: string[] = [],
): Promise<Response> => request(app).delete(path).set('Cookie', cookie);

export type Credentials = {
   email: string;
   password: string;
};

let cookie: string[];

export const currentCookie = () => cookie;

export const login = async (app: Application, credentials: Credentials) => {
   const { email, password } = credentials;
   const res = await post(app, '/session', {
      username: email,
      password,
   });

   cookie = res.headers['set-cookie'];

   return res;
};

export const logout = async (app: Application) =>
   await del(app, '/session', cookie);

export const createUserAndLogin = async (
   app: Application,
   isAdmin: boolean = false,
) => {
   const { email, password } = testUser;
   await createUser({ ...testUser, isAdmin });
   await login(app, { email, password });
};

export const logoutAndDeleteUser = async (app: Application) => {
   await logout(app);
   await deleteUser(testUser.email);
};

export const validQuiz = {
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

export const expectedQuiz = {
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
};
