import { userController } from '@controllers/user.controller';
import express from 'express';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

export = router;