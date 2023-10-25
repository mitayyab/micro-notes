import { Handler, Request, Response } from 'express';
import { ensureAuthenticated } from '@lib/session/session.middleware';
import { validateUsing } from '@lib/validator/joi.middleware';
import { validate as noteValidator } from '@lib/note/note.validator';
import { Note, NoteModel } from '@lib/note/note.model';
import { tryAndCatch } from '@lib/middleware';

const addNote: Handler = async (req: Request, res: Response) => {
   const note: Note = await NoteModel.create(req.body);

   res.json(note);
};

export const post: Handler[] = [
   ensureAuthenticated,
   validateUsing(noteValidator),
   tryAndCatch(addNote),
];
