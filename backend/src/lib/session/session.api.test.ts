import { describe, expect, it } from '@jest/globals';

import app, { stop as stopServer } from '../../server';
import { post, del } from '@lib/test/utils';
import { Type as ErrorType } from '@lib/error/ApiError';
import { createUser, deleteUser } from '@lib/user/user.testutils';

const testUser = {
   firstName: 'Ibrahim',
   lastName: 'Tayyab',
   email: 'ibrahim@tayyab.dev',
   password: 'test123',
   isAdmin: false,
};

let cookie: string[];

const login = async () => {
   const { email, password } = testUser;
   const res = await post(app, '/session', {
      username: email,
      password,
   });

   cookie = res.headers['set-cookie'];

   return res;
};

const logout = async () => await del(app, '/session', cookie);

describe.skip('/session', () => {
   beforeAll(async () => {
      await createUser(testUser);
   });

   describe('POST', () => {
      it('should validate the credentials and provide errors', async () => {
         const res = await post(app, '/session', {});

         expect(res.statusCode).toEqual(400);
         expect(res.headers['set-cookie']).toBeUndefined();
         expect(res.body).toEqual({
            message: 'Invalid request input',
            type: ErrorType.INVALID_INPUT,
            errors: {
               username: '"username" is required',
               password: '"password" is required',
            },
         });
      });

      it('should handle if password is wrong', async () => {
         const res = await post(app, '/session', {
            username: testUser.email,
            password: 'wrong password',
         });

         expect(res.statusCode).toEqual(401);
         expect(res.headers['set-cookie']).toBeUndefined();
         expect(res.body).toEqual({
            message: 'Invalid username or password.',
            type: ErrorType.UNAUTHORIZED,
         });
      });

      it('should login and create the session', async () => {
         const res = await login();

         expect(res.statusCode).toEqual(200);
         expect(cookie).toEqual([expect.any(String)]);
         expect(res.body).toEqual({
            id: expect.any(String),
            email: 'ibrahim@tayyab.dev',
            firstName: 'Ibrahim',
            lastName: 'Tayyab',
         });
      });
   });

   describe('DELETE', () => {
      it('should not allow logout if cookie not sent', async () => {
         const res = await del(app, '/session');

         expect(res.statusCode).toEqual(401);
         expect(res.body).toEqual({
            message: 'User needs to login.',
            type: ErrorType.UNAUTHORIZED,
         });
      });

      it('should logout', async () => {
         if (!cookie) {
            await login();
         }

         expect(cookie).toEqual([expect.any(String)]);

         let res = await logout();

         expect(res.statusCode).toEqual(200);
      });

      it('should not allow using same cookie after logout', async () => {
         if (!cookie) {
            await login();
            await logout();
         }

         expect(cookie).toEqual([expect.any(String)]);

         let res = await logout();

         expect(res.statusCode).toEqual(401);
         expect(res.body).toEqual({
            message: 'User needs to login.',
            type: ErrorType.UNAUTHORIZED,
         });
      });
   });

   afterAll(async () => {
      await deleteUser(testUser.email);
      await stopServer();
   });
});
