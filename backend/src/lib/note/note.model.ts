import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Note extends Document {
   title: string;
   text: string;
}

const NoteSchema = new Schema<Note>({
   title: { type: String, required: true, unique: true },
   text: { type: String, required: true },
});

export const NoteModel: Model<Note> = mongoose.model('Note', NoteSchema);
