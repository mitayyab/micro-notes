import Joi, { ValidationError } from 'joi';
import { Validator, simplifyJoiError } from '@lib/validator/joi';
import { Note } from './note.model';

const schema = Joi.object({
   title: Joi.string().min(10).required(),
   text: Joi.string().min(10).required(),
});

export const validate: Validator<Note> = (note: Note) => {
   const validationResult = schema.validate(note, { abortEarly: false });
   const error: ValidationError = validationResult.error!;

   return simplifyJoiError(error);
};
