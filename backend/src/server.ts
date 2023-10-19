import express, { Application } from 'express';

import configureExpressApp from '@config/express';
import { SERVER_PORT, isTestEnv } from '@config/env';
import {
   connect as connectToDatabase,
   disconnect as disconnectDatabase,
} from '@config/database';

const port = SERVER_PORT || 8080;
const app: Application = express();

await configureExpressApp(app);
await connectToDatabase();

const server = isTestEnv()
   ? undefined
   : app.listen(port, () => {
        console.log(`notes api listening on port ${port}`);
     });

export const stop = async () => {
   await disconnectDatabase();
   server?.close();
};

export default app;
