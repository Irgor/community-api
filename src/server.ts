import dotenv from 'dotenv'; dotenv.config();
import express from 'express';
import fileUpload from 'express-fileupload';
import http from 'http';
import mongoose from 'mongoose';

import { config } from './config/config'
import logger from './utils/logger';

import { auth } from './middlewares/auth.middleware';

import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import reportsRoutes from './routes/reports.routes';
import publicPostRoutes from './routes/publicPosts.routes';

const router = express();

mongoose.connect(config.mongo.url)
  .then(() => {
    logger.log('Mongo Connected');
    start();
  })
  .catch((error) => {
    logger.error('Unable to connect to mongo: ')
    logger.error(error);
  });


const start = () => {
  // CONFIG
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  router.use(fileUpload());

  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).send({});
    }

    next();
  });

  // HEALTHCHECK
  router.get('/', (req, res, next) => res.status(200).send({ status: 'OK' }))
  router.get('/check', (req, res, next) => res.status(200).send({ status: 'OK' }))

  // PUBLIC ROUTES 
  router.use('/users', userRoutes);
  router.use('/posts', publicPostRoutes);
  router.use('/reports', reportsRoutes);

  // AUTH MIDDLEWARE
  router.use((req, res, next) => auth(req, res, next));

  // LOGGED ROUTES 
  router.use('/posts', postRoutes);

  // ERROR HANDLER
  router.use((err: any, req: any, res: any, next: any) => {
    if(err) {
      console.log(err);
    }
    res.status(err.status).send(err.message)
  })

  // START SERVER
  http.createServer(router).listen(process.env.PORT || 3333, () => console.log(`Server is running on ${process.env.PORT || 3333}`))
}