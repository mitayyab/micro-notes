import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

import app, { stop as stopServer } from '../../server';
import { createUserAndLogin, logoutAndDeleteUser, post } from '@lib/test/utils';
import { Type as ErrorType } from '@lib/error/ApiError';
import { currentCookie } from '@lib/test/utils';
import { Note, NoteModel } from './note.model';

describe.skip('/note', () => {
   describe('POST', () => {
      it('should not allow access if user is not logged in', async () => {
         const res = await post(app, '/notes', {});

         expect(res.statusCode).toEqual(401);
         expect(res.body).toEqual({
            message: 'User needs to login.',
            type: ErrorType.UNAUTHORIZED,
         });
      });

      describe('logged in', () => {
         beforeAll(async () => {
            await createUserAndLogin(app);
         });

         it('should validate the input', async () => {
            const note = {
               title: 'I',
               text: 'T',
            };

            const res = await post(app, '/notes', note, currentCookie());
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual({
               errors: {
                  text: '"text" length must be at least 10 characters long',
                  title: '"title" length must be at least 10 characters long',
               },
               message: 'Invalid request input',
               type: ErrorType.INVALID_INPUT,
            });
         });

         it('should save the note', async () => {
            const note = {
               title: 'Some note',
               text: `
                     Any data
                     `,
            };

            let createdNote: Note;

            try {
               const res = await post(app, '/notes', note, currentCookie());
               createdNote = res.body;

               expect(res.statusCode).toEqual(200);
            } finally {
               if (createdNote?.id) {
                  await NoteModel.findByIdAndDelete(createdNote.id);
               }
            }
         });

         afterAll(async () => {
            await logoutAndDeleteUser(app);
         });
      });
   });

   afterAll(async () => await stopServer());
});
