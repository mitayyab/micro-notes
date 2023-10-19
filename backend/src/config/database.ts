import mongoose from 'mongoose';
import {
   NODE_ENV,
   DB_HOST,
   DB_PORT,
   DB_DATABASE,
   DB_PASSWORD,
   DB_USERNAME,
} from '@config/env';

export const URL = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

export const connect = async () => {
   if (NODE_ENV === 'development') {
      mongoose.set('debug', true);
   }

   await mongoose.connect(URL, {});
};

export const disconnect = async () => {
   await mongoose.disconnect();
};
