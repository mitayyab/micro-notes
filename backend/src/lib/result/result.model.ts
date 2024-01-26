import mongoose from 'mongoose';

import {
   QuestionSchemaDefinition,
   Quiz,
   answerChoiceSchemaDefinition,
   schemaDefinition as quizSchemaDefinition,
} from '@lib/quiz/quiz.model';

export interface attemptedQuestion {
   _id?: string;
   text: string;
   answerChoices: {
      text: string;
      correct: boolean;
      selected: boolean;
   }[];
}

export interface attemptedQuiz extends Omit<Quiz, 'questions'> {
   questions: attemptedQuestion[];
}

export interface Result extends Document {
   user: { _id?: string };
   quiz: attemptedQuiz;
   score: number;
}

export const attemptedAnswerChoicesSchema = Object.assign(
   {
      selected: { type: Boolean, required: true },
   },
   answerChoiceSchemaDefinition,
);

export let attemptedQuestionSchema = Object.assign(QuestionSchemaDefinition);
attemptedQuestionSchema.answerChoices = Object.assign(
   [],
   [attemptedAnswerChoicesSchema],
);

export let attemptedQuizSchema = Object.assign({_id: String}, quizSchemaDefinition);
attemptedQuizSchema.questions = Object.assign([], [attemptedQuestionSchema]);

export const resultSchemaDefinition = {
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   quiz: attemptedQuizSchema,
   score: { type: Number, required: true },
};

export const ResultSchema = new mongoose.Schema(resultSchemaDefinition);

export const ResultModel = mongoose.model<Result>('Result', ResultSchema);
