import { describe, expect, it } from '@jest/globals';

import app, { stop as stopServer } from '../../server';
import { post } from '@lib/test/utils';
import { Type as ErrorType } from '@lib/error/ApiError';
import { createUser, deleteUser } from './user.testutils';

describe('/user', () => {
   it('should validate the input and provide errors', async () => {
      const user = {
         firstName: 'Ibrahim',
         lastName: 'Tayyab',
         email: 'ibrahim@tayyab.dev',
         password: 'test123',
      };

      const res = await post(app, '/user', user);

      expect(res.statusCode).toEqual(400);
      expect(res.headers['set-cookie']).toBeUndefined();
      expect(res.body).toEqual({
         message: 'Invalid request input',
         type: ErrorType.INVALID_INPUT,
         errors: {
            password:
               'Password needs 8+ characters, including 1 uppercase, lowercase, number, and special character.',
         },
      });
   });

   it('should register the new user', async () => {
      const user = {
         firstName: 'Ibrahim',
         lastName: 'Tayyab',
         email: 'ibrahim@tayyab.dev',
         password: 'sdfDj9nN!',
      };

      const res = await post(app, '/user', user);

      if (res.statusCode === 200) {
         await deleteUser(user.email);
      }

      expect(res.statusCode).toEqual(200);
      expect(res.headers['set-cookie']).toBeUndefined();
      expect(res.body).toEqual({
         id: expect.any(String),
         email: 'ibrahim@tayyab.dev',
         firstName: 'Ibrahim',
         lastName: 'Tayyab',
      });
   });

   it('should give a duplicate error', async () => {
      const user = {
         firstName: 'Ibrahim',
         lastName: 'Tayyab',
         email: 'ibrahim@tayyab.dev',
         password: 'sdfDj9nN!',
      };

      await createUser({ ...user, isAdmin: false });

      try {
         const res = await post(app, '/user', user);

         expect(res.statusCode).toEqual(409);
         expect(res.headers['set-cookie']).toBeUndefined();
         expect(res.body).toEqual({
            message: 'Record with same field already exists',
            type: ErrorType.UNIQUE_FIELD_VOILATION,
            field: {
               email: 'ibrahim@tayyab.dev',
            },
         });
      } finally {
         await deleteUser(user.email);
      }
   });

   afterAll(async () => await stopServer());
});
