import request, { Response } from 'supertest';
import { Application } from 'express';

export const post = async (
   app: Application,
   path: string,
   body: Record<string, any>
): Promise<Response> =>
   request(app)
      .post(path)
      .send(body)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

export const del = async (
   app: Application,
   path: string,
   cookie: string[] = []
): Promise<Response> => request(app).delete(path).set('Cookie', cookie);
