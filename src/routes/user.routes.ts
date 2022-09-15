import { userController } from '@controllers/user.controller';
import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

export = router;