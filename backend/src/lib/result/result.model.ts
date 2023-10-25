import mongoose from 'mongoose';

export interface Result extends Document {
   user: { _id?: string };
   quiz: { _id?: string };
   answers: [questionNumber: number, selectedChoice: string];
}

export const ResultSchema = new mongoose.Schema ({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
   answers: [
      {
         questionNumber: { type: Number, required: true },
         selectedChoice: { type: String, required: true },
      },
   ],
});

ResultSchema.index({ user: 1, quiz: 1 }, { unique: true, sparse: true });

export const ResultModel = mongoose.model<Result>('Result', ResultSchema);

