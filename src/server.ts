import dotenv from 'dotenv'; dotenv.config();
import express from 'express';
import fileUpload from 'express-fileupload';
import http from 'http';
import mongoose from 'mongoose';
import { config } from '@config/config'
import logger from '@utils/logger';


import postRoutes from '@routes/post.routes';

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
      return res.status(200).json({});
    }

    next();
  });

  // ROUTES 
  router.use('/posts', postRoutes);

  // HEALTHCHECK
  router.get('/check', (req, res, next) => res.status(200).json({ status: 'OK' }))

  // ERROR HANDLER
  router.use((req, res, next) => {
    const error = new Error('Route not found');
    logger.error(error);
    return res.status(404).json({ error: error.message });
  })

  // START SERVER
  http.createServer(router).listen(process.env.PORT || 3000, () => logger.log(`Server is running on ${process.env.PORT || 3000}`))
}