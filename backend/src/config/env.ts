import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const { NODE_ENV } = process.env;
export const { SERVER_PORT, SESSION_SECRET } = process.env;
export const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } =
   process.env;

export const isTestEnv = () => NODE_ENV === 'test';
